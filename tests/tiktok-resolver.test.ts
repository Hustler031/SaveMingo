import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTikTok } from "@/resolver/tiktok";

afterEach(() => {
  vi.restoreAllMocks();
});

function universalPage(itemStruct: Record<string, unknown>) {
  return [
    "<html><body>",
    '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">',
    JSON.stringify({
      __DEFAULT_SCOPE__: {
        "webapp.video-detail": {
          itemInfo: {
            itemStruct,
          },
        },
      },
    }),
    "</script>",
    "</body></html>",
  ].join("");
}

describe("TikTok resolver", () => {
  it("selects the highest bitrate public video source", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        universalPage({
          id: "7420000000000000001",
          video: {
            width: 1080,
            height: 1920,
            cover: "https://p16.tiktokcdn.com/cover/example.jpeg",
            bitrateInfo: [
              {
                Bitrate: 600000,
                PlayAddr: {
                  UrlList: [
                    "https://v16.tiktokcdn.com/video/low.mp4",
                  ],
                },
              },
              {
                Bitrate: 2400000,
                PlayAddr: {
                  UrlList: [
                    "https://v16.tiktokcdn.com/video/high.mp4",
                  ],
                },
              },
            ],
          },
        }),
        { status: 200 },
      ),
    );

    const result = await resolveTikTok(
      "https://www.tiktok.com/@creator/video/7420000000000000001",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "tiktok-public-page",
      strategy: "hydration-json",
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media).toHaveLength(1);
      expect(result.media[0]).toMatchObject({
        type: "video",
        url: "https://v16.tiktokcdn.com/video/high.mp4",
        width: 1080,
        height: 1920,
      });
    }
  });

  it("normalizes TikTok photo posts as a slideshow", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        universalPage({
          id: "7420000000000000002",
          imagePost: {
            images: [
              {
                imageURL: {
                  urlList: [
                    "https://p16.tiktokcdn.com/photo/one.jpeg",
                  ],
                },
              },
              {
                imageURL: {
                  urlList: [
                    "https://p16.tiktokcdn.com/photo/two.jpeg",
                  ],
                },
              },
            ],
          },
        }),
        { status: 200 },
      ),
    );

    const result = await resolveTikTok(
      "https://www.tiktok.com/@creator/photo/7420000000000000002",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "slideshow",
    });

    if (result.ok) {
      expect(result.media).toHaveLength(2);
      expect(result.media.every((item) => item.type === "image")).toBe(true);
    }
  });

  it("returns a TikTok-scoped error when hydration data is absent", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html><body>No hydration JSON</body></html>", {
        status: 200,
      }),
    );

    const result = await resolveTikTok(
      "https://www.tiktok.com/@creator/video/7420000000000000001",
    );

    expect(result).toMatchObject({
      ok: false,
      provider: "tiktok-public-page",
      code: "SM-TT-105",
    });
  });
});
