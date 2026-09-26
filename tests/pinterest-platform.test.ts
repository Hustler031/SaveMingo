import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAllowedPinterestMediaUrl,
  mediaPlatformForUrl,
} from "@/lib/media-url";
import { getPlatformAdapter } from "@/lib/platforms/server-registry";
import { validateSupportedUrl } from "@/lib/platforms/validation";
import { resolvePinterest } from "@/resolver/pinterest";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.PINTEREST_ACCESS_TOKEN;
});

describe("Pinterest isolated adapter foundation", () => {
  it("validates a public Pin URL", () => {
    expect(
      validateSupportedUrl(
        "https://www.pinterest.com/pin/123456789012345678/",
      ),
    ).toMatchObject({
      ok: true,
      platform: "pinterest",
      contentType: "pin",
    });
  });

  it("rejects Pinterest profile URLs", () => {
    expect(
      validateSupportedUrl("https://www.pinterest.com/example/"),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-002",
    });
  });

  it("keeps Pinterest media CDN access platform-scoped", () => {
    expect(
      isAllowedPinterestMediaUrl(
        "https://i.pinimg.com/1200x/example.jpg",
      ),
    ).toBe(true);
    expect(
      mediaPlatformForUrl("https://i.pinimg.com/1200x/example.jpg"),
    ).toBe("pinterest");
    expect(
      isAllowedPinterestMediaUrl(
        "https://video.twimg.com/example.mp4",
      ),
    ).toBe(false);
  });

  it("stays disabled without official API access", async () => {
    const adapter = getPlatformAdapter("pinterest");

    expect(adapter.health()).toMatchObject({
      platform: "pinterest",
      status: "disabled",
    });

    expect(
      await resolvePinterest(
        "https://www.pinterest.com/pin/123456789012345678/",
      ),
    ).toMatchObject({
      ok: false,
      code: "SM-PIN-106",
    });
  });

  it("normalizes the largest image from an official API response", async () => {
    process.env.PINTEREST_ACCESS_TOKEN = "test-token";

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "123456789012345678",
          media: {
            media_type: "image",
            images: {
              "600x": {
                width: 600,
                height: 900,
                url: "https://i.pinimg.com/600x/example.jpg",
              },
              "1200x": {
                width: 1200,
                height: 1800,
                url: "https://i.pinimg.com/1200x/example.jpg",
              },
            },
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const result = await resolvePinterest(
      "https://www.pinterest.com/pin/123456789012345678/",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "photo",
    });

    if (result.ok) {
      expect(result.media[0]).toMatchObject({
        type: "image",
        url: "https://i.pinimg.com/1200x/example.jpg",
        width: 1200,
        height: 1800,
      });
    }
  });
});
