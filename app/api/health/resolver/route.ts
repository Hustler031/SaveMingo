import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    service: "instagram-resolver",
    status: "not_configured",
    phase: "SM-001-foundation",
    requestId: createRequestId(),
    message: "The resolver interface is planned for the next implementation milestone.",
    checkedAt: new Date().toISOString(),
  });
}
