import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveReddit } from "@/resolver/reddit";

afterEach(() => {
  vi.restoreAllMocks();
});

function redditPayload(data: Record<string, unknown>) {
  return JSON.stringify([
    {
      data: {
        children: [{ data }],
      },
    },
    { data: { children: [] } },
  ]);
}

describe("Reddit resolver", () => {
  it("normalizes a Reddit-hosted video track", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        redditPayload({
          secure_media: {
            reddit_video: {
              fallback_url: "https://v.redd.it/example/DASH_720.mp4",
              width: 1280,
              height: 720,
              is_gif: false,
              has_audio: true,
            },
          },
        }),
        { status: 200 },
      ),
    );

    const result = await resolveReddit(
      "https://www.reddit.com/r/videos/comments/abc123/example/",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "reddit-public-json",
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media[0]).toMatchObject({
        type: "video",
        url: "https://v.redd.it/example/DASH_720.mp4",
        audioStatus: "separate",
      });
    }
  });

  it("marks a Reddit video with no reported audio", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        redditPayload({
          secure_media: {
            reddit_video: {
              fallback_url: "https://v.redd.it/example/DASH_480.mp4",
              width: 854,
              height: 480,
              is_gif: false,
              has_audio: false,
            },
          },
        }),
        { status: 200 },
      ),
    );

    const result = await resolveReddit(
      "https://www.reddit.com/r/videos/comments/abc123/example/",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media[0]?.audioStatus).toBe("none");
    }
  });

  it("normalizes a Reddit gallery", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        redditPayload({
          gallery_data: {
            items: [{ media_id: "one" }, { media_id: "two" }],
          },
          media_metadata: {
            one: {
              e: "Image",
              s: {
                u: "https://i.redd.it/one.jpg",
                x: 1000,
                y: 800,
              },
            },
            two: {
              e: "Image",
              s: {
                u: "https://i.redd.it/two.jpg",
                x: 1200,
                y: 900,
              },
            },
          },
        }),
        { status: 200 },
      ),
    );

    const result = await resolveReddit(
      "https://www.reddit.com/r/pics/comments/abc123/gallery/",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "gallery",
    });

    if (result.ok) {
      expect(result.media).toHaveLength(2);
    }
  });
});
