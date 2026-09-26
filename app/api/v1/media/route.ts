import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/lib/errors";
import {
  extensionForContentType,
  isAllowedMediaUrl,
  mediaPlatformForUrl,
  safeMediaFilenameBase,
} from "@/lib/media-url";
import { logOperationalEvent } from "@/lib/observability";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";
import {
  checkRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/reliability/rate-limit";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION } from "@/lib/system";
import type { Platform } from "@/lib/downloader/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

function mediaHost(raw: string) {
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return "invalid";
  }
}

function errorResponse(
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

function requestHeaders(
  range: string | null,
  includeReferer: boolean,
  platform: Platform,
) {
  return {
    Accept: "video/*,image/*,application/octet-stream;q=0.8,*/*;q=0.1",
    "Accept-Language": "en-US,en;q=0.8",
    "User-Agent": USER_AGENT,
    ...(includeReferer
      ? {
          Referer:
            platform === "instagram"
              ? "https://www.instagram.com/"
              : platform === "x"
                ? "https://x.com/"
                : platform === "pinterest"
                ? "https://www.pinterest.com/"
                : "https://www.reddit.com/",
        }
      : {}),
    ...(range ? { Range: range } : {}),
  };
}

async function fetchAllowedMedia(
  sourceUrl: string,
  range: string | null,
  requestId: string,
) {
  let currentUrl = new URL(sourceUrl);
  const sourcePlatform = mediaPlatformForUrl(sourceUrl);

  if (!sourcePlatform) {
    return {
      ok: false as const,
      reason: "blocked-url" as const,
      host: currentUrl.hostname,
    };
  }

  for (
    let redirectCount = 0;
    redirectCount <= RELIABILITY_POLICY.media.maxRedirects;
    redirectCount++
  ) {
    if (mediaPlatformForUrl(currentUrl.toString()) !== sourcePlatform) {
      return {
        ok: false as const,
        reason: "blocked-url" as const,
        host: currentUrl.hostname,
      };
    }

    let response: Response;

    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(
          RELIABILITY_POLICY.media.fetchTimeoutMs,
        ),
        headers: requestHeaders(range, true, sourcePlatform),
      });

      if (response.status === 401 || response.status === 403) {
        logOperationalEvent(
          "media-delivery",
          "warn",
          "media.retry_without_referer",
          {
            requestId,
            host: currentUrl.hostname,
            upstreamStatus: response.status,
          },
        );

        response = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          cache: "no-store",
          signal: AbortSignal.timeout(
            RELIABILITY_POLICY.media.fetchTimeoutMs,
          ),
          headers: requestHeaders(range, false, sourcePlatform),
        });
      }
    } catch (error) {
      return {
        ok: false as const,
        reason:
          error instanceof Error &&
          (error.name === "TimeoutError" || error.name === "AbortError")
            ? ("timeout" as const)
            : ("network" as const),
        host: currentUrl.hostname,
        errorName: error instanceof Error ? error.name : "UnknownError",
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (
        !location ||
        redirectCount === RELIABILITY_POLICY.media.maxRedirects
      ) {
        return {
          ok: false as const,
          reason: "blocked-redirect" as const,
          host: currentUrl.hostname,
          status: response.status,
        };
      }

      const nextUrl = new URL(location, currentUrl);
      if (mediaPlatformForUrl(nextUrl.toString()) !== sourcePlatform) {
        return {
          ok: false as const,
          reason: "blocked-redirect" as const,
          host: nextUrl.hostname,
          status: response.status,
        };
      }

      currentUrl = nextUrl;
      continue;
    }

    if (!response.ok || !response.body) {
      return {
        ok: false as const,
        reason: "upstream" as const,
        host: currentUrl.hostname,
        status: response.status,
        contentType: response.headers.get("content-type"),
      };
    }

    return {
      ok: true as const,
      response,
      host: currentUrl.hostname,
    };
  }

  return {
    ok: false as const,
    reason: "blocked-redirect" as const,
    host: currentUrl.hostname,
  };
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const requestId = createRequestId();
  const rateLimit = checkRequestRateLimit("media", request);
  const limitHeaders = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    logOperationalEvent("media-delivery", "warn", "media.rate_limited", {
      requestId,
      durationMs: Date.now() - startedAt,
    });

    return errorResponse(
      requestId,
      429,
      ERROR_CODES.API_RATE_LIMITED,
      "Too many download requests from this network. Try again shortly.",
      limitHeaders,
    );
  }

  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get("src");
  const filenameBase = safeMediaFilenameBase(
    requestUrl.searchParams.get("name"),
  );
  const inline = requestUrl.searchParams.get("inline") === "1";

  if (!source || !isAllowedMediaUrl(source)) {
    logOperationalEvent("media-delivery", "warn", "media.rejected", {
      requestId,
      sourceHost: source ? mediaHost(source) : "missing",
      reason: "invalid-source",
      durationMs: Date.now() - startedAt,
    });

    return errorResponse(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "This media URL is not allowed for SaveMingo delivery.",
      limitHeaders,
    );
  }

  const sourcePlatform = mediaPlatformForUrl(source);

  if (!sourcePlatform) {
    return errorResponse(
      requestId,
      400,
      ERROR_CODES.INVALID_URL,
      "This media URL is not allowed for SaveMingo delivery.",
      limitHeaders,
    );
  }

  const platformLabel =
    sourcePlatform === "instagram"
      ? "Instagram"
      : sourcePlatform === "x"
        ? "X"
        : sourcePlatform === "pinterest"
          ? "Pinterest"
          : "Reddit";
  const resolverFailureCode =
    sourcePlatform === "instagram"
      ? ERROR_CODES.INSTAGRAM_RESOLVER_FAILED
      : sourcePlatform === "x"
        ? ERROR_CODES.X_RESOLVER_FAILED
        : sourcePlatform === "pinterest"
          ? ERROR_CODES.PINTEREST_RESOLVER_FAILED
          : ERROR_CODES.REDDIT_RESOLVER_FAILED;
  const upstreamChangedCode =
    sourcePlatform === "instagram"
      ? ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED
      : sourcePlatform === "x"
        ? ERROR_CODES.X_UPSTREAM_CHANGED
        : sourcePlatform === "pinterest"
          ? ERROR_CODES.PINTEREST_UPSTREAM_CHANGED
          : ERROR_CODES.REDDIT_UPSTREAM_CHANGED;
  const mediaUnavailableCode =
    sourcePlatform === "instagram"
      ? ERROR_CODES.INSTAGRAM_MEDIA_UNAVAILABLE
      : sourcePlatform === "x"
        ? ERROR_CODES.X_MEDIA_UNAVAILABLE
        : sourcePlatform === "pinterest"
          ? ERROR_CODES.PINTEREST_MEDIA_UNAVAILABLE
          : ERROR_CODES.REDDIT_MEDIA_UNAVAILABLE;

  const upstream = await fetchAllowedMedia(
    source,
    request.headers.get("range"),
    requestId,
  );

  if (!upstream.ok) {
    logOperationalEvent("media-delivery", "warn", "media.failed", {
      requestId,
      sourceHost: mediaHost(source),
      upstreamHost: upstream.host,
      reason: upstream.reason,
      upstreamStatus: "status" in upstream ? upstream.status : undefined,
      upstreamContentType:
        "contentType" in upstream ? upstream.contentType : undefined,
      errorName: "errorName" in upstream ? upstream.errorName : undefined,
      durationMs: Date.now() - startedAt,
    });

    if (upstream.reason === "timeout") {
      return errorResponse(
        requestId,
        504,
        ERROR_CODES.API_TIMEOUT,
        "The media server took too long to respond.",
        limitHeaders,
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
        limitHeaders,
      );
    }

    return errorResponse(
      requestId,
      502,
      resolverFailureCode,
      `SaveMingo could not stream this media from ${platformLabel}.`,
      limitHeaders,
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
    logOperationalEvent(
      "media-delivery",
      "warn",
      "media.invalid_content_type",
      {
        requestId,
        sourceHost: mediaHost(source),
        upstreamHost: upstream.host,
        upstreamStatus: response.status,
        upstreamContentType: contentType,
        durationMs: Date.now() - startedAt,
      },
    );

    return errorResponse(
      requestId,
      502,
      upstreamChangedCode,
      `${platformLabel} returned an unexpected media format.`,
      limitHeaders,
    );
  }

  const contentLength = Number.parseInt(
    response.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > RELIABILITY_POLICY.media.maxDeclaredBytes
  ) {
    logOperationalEvent("media-delivery", "warn", "media.too_large", {
      requestId,
      sourceHost: mediaHost(source),
      upstreamHost: upstream.host,
      contentLength,
      durationMs: Date.now() - startedAt,
    });

    return errorResponse(
      requestId,
      413,
      mediaUnavailableCode,
      "This media item is larger than SaveMingo’s current delivery limit.",
      limitHeaders,
    );
  }

  const extension = extensionForContentType(contentType);
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filenameBase}.${extension}"`,
    "Content-Type": contentType || "application/octet-stream",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-SaveMingo-Request-Id": requestId,
    "X-SaveMingo-Version": APP_VERSION,
    ...limitHeaders,
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

  logOperationalEvent("media-delivery", "info", "media.success", {
    requestId,
    sourceHost: mediaHost(source),
    upstreamHost: upstream.host,
    upstreamStatus: response.status,
    contentType: normalizedType,
    contentLength:
      Number.isFinite(contentLength) && contentLength > 0
        ? contentLength
        : undefined,
    range: Boolean(request.headers.get("range")),
    durationMs: Date.now() - startedAt,
  });

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
