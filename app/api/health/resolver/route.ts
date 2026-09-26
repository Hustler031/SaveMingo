import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION, BUILD_PHASE } from "@/lib/system";
import { releaseContext } from "@/lib/observability";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      service: "instagram-resolver",
      status: "healthy",
      version: APP_VERSION,
      phase: BUILD_PHASE,
      release: releaseContext(),
      requestId: createRequestId(),
      providers: ["public-page", "graphql"],
      capabilities: {
        reelVideo: "live-verified",
        videoPost: "implemented",
        photo: "implemented-unit-verified",
        carousel: "live-verified",
        sameOriginDelivery: "live-verified",
      },
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
