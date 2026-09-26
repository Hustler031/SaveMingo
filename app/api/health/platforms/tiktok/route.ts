import { NextResponse } from "next/server";
import { getPlatformAdapter } from "@/lib/platforms/server-registry";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION } from "@/lib/system";

export const dynamic = "force-dynamic";

export function GET() {
  const health = getPlatformAdapter("tiktok").health();

  return NextResponse.json(
    {
      ...health,
      requestId: createRequestId(),
      version: APP_VERSION,
      checkedAt: new Date().toISOString(),
    },
    {
      status: health.status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "X-SaveMingo-Version": APP_VERSION,
      },
    },
  );
}
