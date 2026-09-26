import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveX } from "@/resolver/x";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("X resolver", () => {
  it("normalizes the highest bitrate MP4 video variant", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          __typename: "Tweet",
          id_str: "2006254902629044564",
          mediaDetails: [
            {
              type: "video",
              media_url_https:
                "https://pbs.twimg.com/ext_tw_video_thumb/example.jpg",
              original_info: {
                width: 1280,
                height: 720,
              },
              video_info: {
                variants: [
                  {
                    bitrate: 256000,
                    content_type: "video/mp4",
                    url: "https://video.twimg.com/ext_tw_video/example/vid/640x360/low.mp4",
                  },
                  {
                    bitrate: 2176000,
                    content_type: "video/mp4",
                    url: "https://video.twimg.com/ext_tw_video/example/vid/1280x720/high.mp4",
                  },
                  {
                    content_type: "application/x-mpegURL",
                    url: "https://video.twimg.com/ext_tw_video/example/pl/master.m3u8",
                  },
                ],
              },
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const result = await resolveX(
      "https://x.com/example/status/2006254902629044564",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "x-syndication",
      strategy: "public-syndication",
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media).toHaveLength(1);
      expect(result.media[0]).toMatchObject({
        type: "video",
        url: "https://video.twimg.com/ext_tw_video/example/vid/1280x720/high.mp4",
        width: 1280,
        height: 720,
      });
    }

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      "id=2006254902629044564",
    );
  });

  it("normalizes multiple photos as a carousel", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          __typename: "Tweet",
          photos: [
            {
              url: "https://pbs.twimg.com/media/photo-one.jpg",
              width: 1600,
              height: 900,
            },
            {
              url: "https://pbs.twimg.com/media/photo-two.jpg",
              width: 1200,
              height: 1200,
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const result = await resolveX(
      "https://x.com/example/status/2006254902629044564",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "carousel",
    });

    if (result.ok) {
      expect(result.media).toHaveLength(2);
      expect(result.media.every((item) => item.type === "image")).toBe(true);
    }
  });

  it("returns an X-scoped error when a public post has no downloadable media", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          __typename: "Tweet",
          id_str: "2006254902629044564",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const result = await resolveX(
      "https://x.com/example/status/2006254902629044564",
    );

    expect(result).toMatchObject({
      ok: false,
      provider: "x-syndication",
      code: "SM-X-103",
    });
  });
});
