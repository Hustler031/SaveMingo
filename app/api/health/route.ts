import { NextResponse } from "next/server";
import { createRequestId } from "@/lib/request-id";
import { systemHealth } from "@/lib/system";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ...systemHealth(),
      requestId: createRequestId(),
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
