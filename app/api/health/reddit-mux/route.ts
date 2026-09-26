import { NextResponse } from "next/server";
import { ERROR_CODES } from "@/lib/errors";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION } from "@/lib/system";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = createRequestId();
  const serviceUrl = process.env.REDDIT_MUX_SERVICE_URL?.trim();
  const serviceToken = process.env.REDDIT_MUX_SERVICE_TOKEN?.trim();

  if (!serviceUrl || !serviceToken) {
    return NextResponse.json(
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
    const response = await fetch(new URL("/health", serviceUrl), {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });

    const payload = (await response.json()) as {
      status?: string;
      ffmpeg?: boolean;
    };

    const healthy =
      response.ok &&
      payload.status === "healthy" &&
      payload.ffmpeg === true;

    return NextResponse.json(
      {
        service: "reddit-mux",
        status: healthy ? "healthy" : "degraded",
        ffmpeg: payload.ffmpeg ?? false,
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
    return NextResponse.json(
      {
        service: "reddit-mux",
        status: "unreachable",
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
}
