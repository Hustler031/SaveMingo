import { NextResponse } from "next/server";
import type {
  ResolveFailure,
  ResolveResponse,
  ResolveSuccess,
} from "@/lib/downloader/types";
import { ERROR_CODES, type SaveMingoErrorCode } from "@/lib/errors";
import { logOperationalEvent } from "@/lib/observability";
import { getPlatformAdapter } from "@/lib/platforms/server-registry";
import { validateSupportedUrl } from "@/lib/platforms/validation";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";
import {
  checkRequestRateLimit,
  rateLimitHeaders,
} from "@/lib/reliability/rate-limit";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION } from "@/lib/system";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResolveRequestBody = {
  url?: unknown;
};

function statusForError(code: SaveMingoErrorCode) {
  switch (code) {
    case ERROR_CODES.INVALID_URL:
    case ERROR_CODES.UNSUPPORTED_URL:
      return 400;
    case ERROR_CODES.INSTAGRAM_PRIVATE:
    case ERROR_CODES.X_PRIVATE:
    case ERROR_CODES.PINTEREST_PRIVATE:
    case ERROR_CODES.REDDIT_PRIVATE:
      return 403;
    case ERROR_CODES.INSTAGRAM_NOT_FOUND:
    case ERROR_CODES.X_NOT_FOUND:
    case ERROR_CODES.PINTEREST_NOT_FOUND:
    case ERROR_CODES.REDDIT_NOT_FOUND:
      return 404;
    case ERROR_CODES.API_PAYLOAD_TOO_LARGE:
      return 413;
    case ERROR_CODES.API_RATE_LIMITED:
      return 429;
    case ERROR_CODES.API_TIMEOUT:
      return 504;
    default:
      return 502;
  }
}

function json(
  payload: ResolveResponse,
  status: number,
  requestId: string,
  extraHeaders: Record<string, string> = {},
) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-SaveMingo-Request-Id": requestId,
      "X-SaveMingo-Version": APP_VERSION,
      ...extraHeaders,
    },
  });
}

function failure(
  requestId: string,
  code: SaveMingoErrorCode,
  message: string,
): ResolveFailure {
  return {
    success: false,
    requestId,
    error: {
      code,
      message,
    },
  };
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const startedAt = Date.now();
  const rateLimit = checkRequestRateLimit("resolve", request);
  const limitHeaders = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    const result = failure(
      requestId,
      ERROR_CODES.API_RATE_LIMITED,
      "Too many requests from this network. Try again shortly.",
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rate_limited", {
      requestId,
      code: result.error.code,
      durationMs: Date.now() - startedAt,
    });

    return json(result, 429, requestId, limitHeaders);
  }

  const declaredLength = Number.parseInt(
    request.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(declaredLength) &&
    declaredLength > RELIABILITY_POLICY.resolve.maxBodyBytes
  ) {
    const result = failure(
      requestId,
      ERROR_CODES.API_PAYLOAD_TOO_LARGE,
      "The request body is larger than SaveMingo accepts.",
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rejected", {
      requestId,
      code: result.error.code,
      reason: "declared-body-too-large",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 413, requestId, limitHeaders);
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return json(
      failure(
        requestId,
        ERROR_CODES.INVALID_URL,
        "Send a valid JSON request containing a supported public URL.",
      ),
      400,
      requestId,
      limitHeaders,
    );
  }

  if (
    new TextEncoder().encode(rawBody).byteLength >
    RELIABILITY_POLICY.resolve.maxBodyBytes
  ) {
    const result = failure(
      requestId,
      ERROR_CODES.API_PAYLOAD_TOO_LARGE,
      "The request body is larger than SaveMingo accepts.",
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rejected", {
      requestId,
      code: result.error.code,
      reason: "body-too-large",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 413, requestId, limitHeaders);
  }

  let body: ResolveRequestBody;

  try {
    body = JSON.parse(rawBody) as ResolveRequestBody;
  } catch {
    const result = failure(
      requestId,
      ERROR_CODES.INVALID_URL,
      "Send a valid JSON request containing a supported public URL.",
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rejected", {
      requestId,
      code: result.error.code,
      reason: "invalid-json",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 400, requestId, limitHeaders);
  }

  if (typeof body.url !== "string" || body.url.length > 2_048) {
    const result = failure(
      requestId,
      ERROR_CODES.INVALID_URL,
      "Paste a supported public Instagram, X, Pinterest, or Reddit link to continue.",
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rejected", {
      requestId,
      code: result.error.code,
      reason: "invalid-url-shape",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 400, requestId, limitHeaders);
  }

  const validated = validateSupportedUrl(body.url);

  if (!validated.ok) {
    const result = failure(
      requestId,
      validated.code,
      validated.message,
    );

    logOperationalEvent("resolve-api", "warn", "resolve.rejected", {
      requestId,
      code: result.error.code,
      reason: "url-validation",
      durationMs: Date.now() - startedAt,
    });

    return json(
      result,
      statusForError(result.error.code),
      requestId,
      limitHeaders,
    );
  }

  const adapter = getPlatformAdapter(validated.platform);

  try {
    const providerResult = await adapter.resolve(validated);

    if (!providerResult.ok) {
      const result = failure(
        requestId,
        providerResult.code,
        providerResult.message,
      );

      logOperationalEvent("resolve-api", "warn", "resolve.failed", {
        requestId,
        platform: validated.platform,
        provider: providerResult.provider,
        diagnostic: providerResult.diagnostic,
        debug: providerResult.debug,
        code: providerResult.code,
        contentType: validated.contentType,
        durationMs: Date.now() - startedAt,
      });

      return json(
        result,
        statusForError(result.error.code),
        requestId,
        limitHeaders,
      );
    }

    const result: ResolveSuccess = {
      success: true,
      requestId,
      platform: validated.platform,
      contentType: providerResult.contentType,
      sourceUrl: validated.normalizedUrl,
      media: providerResult.media,
    };

    logOperationalEvent("resolve-api", "info", "resolve.success", {
      requestId,
      platform: result.platform,
      provider: providerResult.provider,
      strategy: providerResult.strategy,
      contentType: result.contentType,
      mediaCount: result.media.length,
      durationMs: Date.now() - startedAt,
    });

    return json(result, 200, requestId, limitHeaders);
  } catch (error) {
    const result = failure(
      requestId,
      adapter.unexpectedErrorCode,
      "SaveMingo hit an unexpected platform resolver error.",
    );

    logOperationalEvent("resolve-api", "error", "resolve.exception", {
      requestId,
      platform: validated.platform,
      code: result.error.code,
      errorName: error instanceof Error ? error.name : "UnknownError",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 502, requestId, limitHeaders);
  }
}
