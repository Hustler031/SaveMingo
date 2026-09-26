import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/lib/errors";
import {
  extensionForContentType,
  isAllowedInstagramMediaUrl,
  safeMediaFilenameBase,
} from "@/lib/media-url";
import { createRequestId } from "@/lib/request-id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REDIRECTS = 3;
const MAX_DECLARED_BYTES = 250 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

function errorResponse(
  requestId: string,
  status: number,
  code: string,
  message: string,
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
      },
    },
  );
}

async function fetchAllowedMedia(
  sourceUrl: string,
  range: string | null,
) {
  let currentUrl = new URL(sourceUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    if (!isAllowedInstagramMediaUrl(currentUrl.toString())) {
      return {
        ok: false as const,
        reason: "blocked-url" as const,
      };
    }

    let response: Response;

    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          Accept: "video/*,image/*,application/octet-stream;q=0.8,*/*;q=0.1",
          "Accept-Language": "en-US,en;q=0.8",
          Referer: "https://www.instagram.com/",
          "User-Agent": USER_AGENT,
          ...(range ? { Range: range } : {}),
        },
      });
    } catch (error) {
      return {
        ok: false as const,
        reason:
          error instanceof Error &&
          (error.name === "TimeoutError" || error.name === "AbortError")
            ? ("timeout" as const)
            : ("network" as const),
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (!location || redirectCount === MAX_REDIRECTS) {
        return {
          ok: false as const,
          reason: "blocked-redirect" as const,
        };
      }

      currentUrl = new URL(location, currentUrl);
      continue;
    }

    if (!response.ok || !response.body) {
      return {
        ok: false as const,
        reason: "upstream" as const,
        status: response.status,
      };
    }

    return {
      ok: true as const,
      response,
    };
  }

  return {
    ok: false as const,
    reason: "blocked-redirect" as const,
  };
}

export async function GET(request: Request) {
  const requestId = createRequestId();
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get("src");
  const filenameBase = safeMediaFilenameBase(
    requestUrl.searchParams.get("name"),
  );

  if (!source || !isAllowedInstagramMediaUrl(source)) {
    return errorResponse(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "This media URL is not allowed for SaveMingo delivery.",
    );
  }

  const upstream = await fetchAllowedMedia(
    source,
    request.headers.get("range"),
  );

  if (!upstream.ok) {
    if (upstream.reason === "timeout") {
      return errorResponse(
        requestId,
        504,
        ERROR_CODES.API_TIMEOUT,
        "The media server took too long to respond.",
      );
    }

    if (
      upstream.reason === "blocked-url" ||
      upstream.reason === "blocked-redirect"
    ) {
      return errorResponse(
        requestId,
        403,
        ERROR_CODES.INVALID_URL,
        "The media server redirected outside SaveMingo’s allowed CDN list.",
      );
    }

    return errorResponse(
      requestId,
      502,
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "SaveMingo could not stream this media from Instagram.",
    );
  }

  const { response } = upstream;
  const contentType = response.headers.get("content-type");
  const normalizedType =
    contentType?.split(";", 1)[0]?.trim().toLowerCase() ?? "";

  if (
    !normalizedType.startsWith("video/") &&
    !normalizedType.startsWith("image/") &&
    normalizedType !== "application/octet-stream"
  ) {
    return errorResponse(
      requestId,
      502,
      ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
      "Instagram returned an unexpected media format.",
    );
  }

  const contentLength = Number.parseInt(
    response.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_DECLARED_BYTES
  ) {
    return errorResponse(
      requestId,
      413,
      ERROR_CODES.INSTAGRAM_MEDIA_UNAVAILABLE,
      "This media item is larger than SaveMingo’s current delivery limit.",
    );
  }

  const extension = extensionForContentType(contentType);
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Disposition": `attachment; filename="${filenameBase}.${extension}"`,
    "Content-Type": contentType || "application/octet-stream",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-SaveMingo-Request-Id": requestId,
  });

  for (const name of [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const value = response.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
