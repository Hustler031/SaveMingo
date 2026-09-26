import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/lib/errors";
import { logOperationalEvent } from "@/lib/observability";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";
import {
  checkRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/reliability/rate-limit";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION } from "@/lib/system";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MuxRequest = {
  videoUrl?: unknown;
  manifestUrl?: unknown;
  fileName?: unknown;
};

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

function jsonError(
  requestId: string,
  status: number,
  code: string,
  message: string,
  extraHeaders: Record<string, string> = {},
) {
  return NextResponse.json(
    {
      success: false,
      requestId,
      error: {
        code,
        message,
      },
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

export async function POST(request: Request) {
  const requestId = createRequestId();
  const startedAt = Date.now();
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

  const serviceUrl = process.env.REDDIT_MUX_SERVICE_URL?.trim();
  const serviceToken = process.env.REDDIT_MUX_SERVICE_TOKEN?.trim();

  if (!serviceUrl || !serviceToken) {
    logOperationalEvent("reddit-mux", "warn", "mux.unconfigured", {
      requestId,
      durationMs: Date.now() - startedAt,
    });

    return jsonError(
      requestId,
      503,
      ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
      "Reddit sound merging is not configured on this SaveMingo environment.",
      limitHeaders,
    );
  }

  const declaredLength = Number.parseInt(
    request.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(declaredLength) &&
    declaredLength > RELIABILITY_POLICY.redditMux.maxBodyBytes
  ) {
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

  if (
    new TextEncoder().encode(rawBody).byteLength >
    RELIABILITY_POLICY.redditMux.maxBodyBytes
  ) {
    return jsonError(
      requestId,
      413,
      ERROR_CODES.API_PAYLOAD_TOO_LARGE,
      "The Reddit merge request is larger than SaveMingo accepts.",
      limitHeaders,
    );
  }

  let body: MuxRequest;

  try {
    body = JSON.parse(rawBody) as MuxRequest;
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

  let endpoint: URL;

  try {
    endpoint = new URL("/mux", serviceUrl);
  } catch {
    return jsonError(
      requestId,
      503,
      ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
      "The Reddit sound merge service is not configured correctly.",
      limitHeaders,
    );
  }

  let upstream: Response;

  try {
    upstream = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(
        RELIABILITY_POLICY.redditMux.proxyTimeoutMs,
      ),
      headers: {
        Authorization: "Bearer " + serviceToken,
        "Content-Type": "application/json",
        "X-SaveMingo-Request-Id": requestId,
      },
      body: JSON.stringify({
        videoUrl,
        manifestUrl,
        fileName,
      }),
    });
  } catch (error) {
    logOperationalEvent("reddit-mux", "error", "mux.network_failed", {
      requestId,
      errorName: error instanceof Error ? error.name : "UnknownError",
      durationMs: Date.now() - startedAt,
    });

    return jsonError(
      requestId,
      502,
      ERROR_CODES.REDDIT_MUX_UNAVAILABLE,
      "Reddit sound merging is temporarily unavailable. You can still download the video-only file.",
      limitHeaders,
    );
  }

  if (!upstream.ok || !upstream.body) {
    let upstreamError = "mux-failed";

    try {
      const payload = (await upstream.json()) as {
        error?: string;
      };
      upstreamError = payload.error ?? upstreamError;
    } catch {
      // Keep the generic diagnostic.
    }

    logOperationalEvent("reddit-mux", "warn", "mux.failed", {
      requestId,
      upstreamStatus: upstream.status,
      upstreamError,
      durationMs: Date.now() - startedAt,
    });

    return jsonError(
      requestId,
      upstream.status === 422 ? 422 : 502,
      ERROR_CODES.REDDIT_MUX_FAILED,
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
    "X-SaveMingo-Mux": "reddit-dash-audio",
    ...limitHeaders,
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  logOperationalEvent("reddit-mux", "info", "mux.success", {
    requestId,
    durationMs: Date.now() - startedAt,
    contentLength: contentLength
      ? Number.parseInt(contentLength, 10)
      : undefined,
  });

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
