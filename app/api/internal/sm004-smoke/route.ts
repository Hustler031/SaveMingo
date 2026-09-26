import { NextResponse } from "next/server";
import { resolveInstagram } from "@/resolver/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHOTO_URL = "https://www.instagram.com/p/DCMUrLltVlM/";

export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const result = await resolveInstagram(PHOTO_URL, "post");

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        provider: result.provider,
        code: result.code,
        diagnostic: result.diagnostic,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    provider: result.provider,
    strategy: result.strategy,
    contentType: result.contentType,
    mediaCount: result.media.length,
    mediaTypes: result.media.map((item) => item.type),
  });
}
