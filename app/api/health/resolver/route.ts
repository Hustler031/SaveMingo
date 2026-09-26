import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";
import { APP_VERSION, BUILD_PHASE } from "@/lib/system";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      service: "instagram-resolver",
      status: "healthy",
      version: APP_VERSION,
      phase: BUILD_PHASE,
      requestId: createRequestId(),
      providers: ["public-page", "graphql"],
      capabilities: {
        reelVideo: "live-verified",
        videoPost: "implemented",
        photo: "implemented-unit-verified",
        carousel: "live-verified",
        mediaDelivery: "live-verified",
      },
      notes: {
        photo:
          "Single-photo normalization is implemented and unit-verified; stable independent live-photo fixture verification remains pending.",
        mediaDelivery:
          "Signed Meta CDN URLs can intermittently expire or return 403; fresh URLs have been verified streaming through SaveMingo.",
      },
      checkedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-SaveMingo-Version": APP_VERSION,
      },
    },
  );
}
