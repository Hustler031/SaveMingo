import { NextResponse } from "next/server";
import type {
  ResolveFailure,
  ResolveResponse,
  ResolveSuccess,
} from "@/lib/downloader/types";
import { ERROR_CODES, type SaveMingoErrorCode } from "@/lib/errors";
import { createRequestId } from "@/lib/request-id";
import { validateInstagramUrl } from "@/lib/downloader/validation";
import { resolveInstagram } from "@/resolver/instagram";

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
      return 403;
    case ERROR_CODES.INSTAGRAM_NOT_FOUND:
      return 404;
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
) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-SaveMingo-Request-Id": requestId,
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

function logResolve(
  level: "info" | "warn" | "error",
  data: Record<string, unknown>,
) {
  const entry = JSON.stringify({
    service: "resolve-api",
    ...data,
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const startedAt = Date.now();

  let body: ResolveRequestBody;

  try {
    body = (await request.json()) as ResolveRequestBody;
  } catch {
    const result = failure(
      requestId,
      ERROR_CODES.INVALID_URL,
      "Send a valid JSON request containing an Instagram URL.",
    );

    logResolve("warn", {
      event: "resolve.rejected",
      requestId,
      code: result.error.code,
      durationMs: Date.now() - startedAt,
    });

    return json(result, 400, requestId);
  }

  if (typeof body.url !== "string" || body.url.length > 2_048) {
    const result = failure(
      requestId,
      ERROR_CODES.INVALID_URL,
      "Paste a valid Instagram link to continue.",
    );

    logResolve("warn", {
      event: "resolve.rejected",
      requestId,
      code: result.error.code,
      durationMs: Date.now() - startedAt,
    });

    return json(result, 400, requestId);
  }

  const validated = validateInstagramUrl(body.url);

  if (!validated.ok) {
    const result = failure(
      requestId,
      validated.code,
      validated.message,
    );

    logResolve("warn", {
      event: "resolve.rejected",
      requestId,
      code: result.error.code,
      durationMs: Date.now() - startedAt,
    });

    return json(result, statusForError(result.error.code), requestId);
  }

  try {
    const providerResult = await resolveInstagram(
      validated.normalizedUrl,
      validated.contentType,
    );

    if (!providerResult.ok) {
      const result = failure(
        requestId,
        providerResult.code,
        providerResult.message,
      );

      logResolve("warn", {
        event: "resolve.failed",
        requestId,
        provider: providerResult.provider,
        diagnostic: providerResult.diagnostic,
        code: providerResult.code,
        contentType: validated.contentType,
        durationMs: Date.now() - startedAt,
      });

      return json(result, statusForError(result.error.code), requestId);
    }

    const result: ResolveSuccess = {
      success: true,
      requestId,
      platform: "instagram",
      contentType: providerResult.contentType,
      sourceUrl: validated.normalizedUrl,
      media: providerResult.media,
    };

    logResolve("info", {
      event: "resolve.success",
      requestId,
      provider: providerResult.provider,
      contentType: result.contentType,
      mediaCount: result.media.length,
      durationMs: Date.now() - startedAt,
    });

    return json(result, 200, requestId);
  } catch (error) {
    const result = failure(
      requestId,
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "SaveMingo hit an unexpected resolver error.",
    );

    logResolve("error", {
      event: "resolve.exception",
      requestId,
      code: result.error.code,
      errorName: error instanceof Error ? error.name : "UnknownError",
      durationMs: Date.now() - startedAt,
    });

    return json(result, 502, requestId);
  }
}
