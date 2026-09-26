import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    service: "instagram-resolver",
    status: "healthy",
    phase: "SM-003-instagram-resolver",
    requestId: createRequestId(),
    providers: ["public-page", "graphql"],
    capabilities: {
      reelVideo: "live-verified",
      videoPost: "implemented",
      photo: "planned-SM-004",
      carousel: "planned-SM-004",
    },
    checkedAt: new Date().toISOString(),
  });
}
