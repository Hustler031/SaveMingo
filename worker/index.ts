import handler from "vinext/server/fetch-handler";
import { ERROR_CODES } from "../lib/errors";
import {
  checkRequestRateLimit,
  rateLimitHeaders,
} from "../lib/reliability/rate-limit";
import { createRequestId } from "../lib/request-id";
import { APP_VERSION } from "../lib/system";

type ServiceBinding = {
  fetch(input: Request): Promise<Response>;
};

type VinextEnv = Parameters<typeof handler.fetch>[1];
type VinextContext = Parameters<typeof handler.fetch>[2];

type WorkerEnv = VinextEnv & {
  REDDIT_MUX?: ServiceBinding;
};

function jsonError(
  requestId: string,
  status: number,
  code: string,
  message: string,
  extraHeaders: Record<string, string> = {},
) {
  return Response.json(
    {
      success: false,
      requestId,
      error: { code, message },
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-SaveMingo-Request-Id": requestId,
        "X-SaveMingo-Version": APP_VERSION,
        ...extraHeaders,
      },
    },
  );
}

function isAllowedRedditDashUrl(raw: string) {
  try {
    const url = new URL(raw);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      url.hostname.toLowerCase().replace(/\.$/, "") === "v.redd.it"
    );
  } catch {
    return false;
  }
}

async function handleMux(request: Request, env: WorkerEnv) {
  const requestId = createRequestId();
  const rateLimit = checkRequestRateLimit("media", request);
  const limitHeaders = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return jsonError(
      requestId,
      429,
      ERROR_CODES.API_RATE_LIMITED,
      "Too many Reddit merge requests from this network. Try again shortly.",
      limitHeaders,
    );
  }

  if (!env.REDDIT_MUX) {
    return jsonError(
      requestId,
      503,
      ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
      "Reddit sound merging is temporarily unavailable. You can still download the video-only file.",
      limitHeaders,
    );
  }

  const declaredLength = Number.parseInt(
    request.headers.get("content-length") ?? "0",
    10,
  );

  if (Number.isFinite(declaredLength) && declaredLength > 8_192) {
    return jsonError(
      requestId,
      413,
      ERROR_CODES.API_PAYLOAD_TOO_LARGE,
      "The Reddit merge request is larger than SaveMingo accepts.",
      limitHeaders,
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonError(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "Send a valid Reddit merge request.",
      limitHeaders,
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > 8_192) {
    return jsonError(
      requestId,
      413,
      ERROR_CODES.API_PAYLOAD_TOO_LARGE,
      "The Reddit merge request is larger than SaveMingo accepts.",
      limitHeaders,
    );
  }

  let body: {
    videoUrl?: unknown;
    manifestUrl?: unknown;
    fileName?: unknown;
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "Send a valid Reddit merge request.",
      limitHeaders,
    );
  }

  const videoUrl =
    typeof body.videoUrl === "string" ? body.videoUrl : "";
  const manifestUrl =
    typeof body.manifestUrl === "string" ? body.manifestUrl : "";
  const fileName =
    typeof body.fileName === "string"
      ? body.fileName.slice(0, 100)
      : "reddit-video-with-sound";

  if (
    !isAllowedRedditDashUrl(videoUrl) ||
    !isAllowedRedditDashUrl(manifestUrl)
  ) {
    return jsonError(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "Only validated Reddit video and DASH audio sources can be merged.",
      limitHeaders,
    );
  }

  let upstream: Response;

  try {
    upstream = await env.REDDIT_MUX.fetch(
      new Request("https://reddit-mux.internal/mux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SaveMingo-Request-Id": requestId,
        },
        body: JSON.stringify({
          videoUrl,
          manifestUrl,
          fileName,
        }),
      }),
    );
  } catch {
    return jsonError(
      requestId,
      503,
      ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
      "Reddit sound merging is temporarily unavailable. You can still download the video-only file.",
      limitHeaders,
    );
  }

  if (!upstream.ok || !upstream.body) {
    const unavailable = upstream.status === 503;

    return jsonError(
      requestId,
      upstream.status === 422 ? 422 : unavailable ? 503 : 502,
      unavailable
        ? ERROR_CODES.REDDIT_MUX_UNAVAILABLE
        : ERROR_CODES.REDDIT_MUX_FAILED,
      upstream.status === 422
        ? "Reddit reported audio, but SaveMingo could not locate a usable audio track for this video."
        : "SaveMingo could not merge this Reddit video with sound. The video-only download is still available.",
      limitHeaders,
    );
  }

  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Type": "video/mp4",
    "Content-Disposition":
      upstream.headers.get("content-disposition") ??
      'attachment; filename="reddit-video-with-sound.mp4"',
    "X-Content-Type-Options": "nosniff",
    "X-SaveMingo-Request-Id": requestId,
    "X-SaveMingo-Version": APP_VERSION,
    "X-SaveMingo-Mux": "cloudflare-container",
    ...limitHeaders,
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}

async function handleMuxHealth(env: WorkerEnv) {
  const requestId = createRequestId();

  if (!env.REDDIT_MUX) {
    return Response.json(
      {
        service: "reddit-mux",
        status: "unconfigured",
        code: ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
        requestId,
        version: APP_VERSION,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-SaveMingo-Request-Id": requestId,
        },
      },
    );
  }

  try {
    const response = await env.REDDIT_MUX.fetch(
      new Request("https://reddit-mux.internal/health?deep=1"),
    );
    const payload = (await response.json()) as {
      status?: string;
      ffmpeg?: boolean;
    };
    const healthy =
      response.ok &&
      payload.status === "healthy" &&
      payload.ffmpeg === true;

    return Response.json(
      {
        service: "reddit-mux",
        status: healthy ? "healthy" : "degraded",
        ffmpeg: payload.ffmpeg ?? false,
        runtime: "cloudflare-container",
        requestId,
        version: APP_VERSION,
      },
      {
        status: healthy ? 200 : 503,
        headers: {
          "Cache-Control": "no-store",
          "X-SaveMingo-Request-Id": requestId,
        },
      },
    );
  } catch {
    return Response.json(
      {
        service: "reddit-mux",
        status: "unreachable",
        code: ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
        runtime: "cloudflare-container",
        requestId,
        version: APP_VERSION,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-SaveMingo-Request-Id": requestId,
        },
      },
    );
  }
}

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    ctx: VinextContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (
      request.method === "POST" &&
      url.pathname === "/api/v1/reddit/mux"
    ) {
      return handleMux(request, env);
    }

    if (
      request.method === "GET" &&
      url.pathname === "/api/health/reddit-mux"
    ) {
      return handleMuxHealth(env);
    }

    return handler.fetch(request, env, ctx);
  },
};
