import { afterEach, describe, expect, it, vi } from "vitest";
import { resolvePinterest } from "@/resolver/pinterest";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Pinterest resolver", () => {
  it("prefers public video metadata when a pin exposes MP4", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        '<html><head><meta property="og:video" content="https://v1.pinimg.com/videos/720x1280/example.mp4"><meta property="og:image" content="https://i.pinimg.com/originals/example.jpg"></head></html>',
        {
          status: 200,
          headers: { "content-type": "text/html" },
        },
      ),
    );

    const result = await resolvePinterest(
      "https://www.pinterest.com/pin/123456789012345678/",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "pinterest-public-page",
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media[0]).toMatchObject({
        type: "video",
        url: "https://v1.pinimg.com/videos/720x1280/example.mp4",
        width: 720,
        height: 1280,
      });
    }
  });

  it("falls back to public image metadata", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        '<html><head><meta property="og:image" content="https://i.pinimg.com/originals/example.jpg"></head></html>',
        { status: 200 },
      ),
    );

    const result = await resolvePinterest(
      "https://www.pinterest.com/pin/123456789012345678/",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "photo",
    });
  });
});
