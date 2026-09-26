import { NextResponse } from "next/server";
import { platformHealth } from "@/lib/platforms/server-registry";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION, BUILD_PHASE } from "@/lib/system";

export const dynamic = "force-dynamic";

export function GET() {
  const platforms = platformHealth();
  const status = platforms.every((platform) => platform.status === "healthy")
    ? "healthy"
    : "degraded";

  return NextResponse.json(
    {
      service: "platform-resolvers",
      status,
      version: APP_VERSION,
      phase: BUILD_PHASE,
      requestId: createRequestId(),
      platforms,
      checkedAt: new Date().toISOString(),
    },
    {
      status: status === "healthy" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
        "X-SaveMingo-Version": APP_VERSION,
      },
    },
  );
}
