import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAllowedRedditMediaUrl,
  mediaPlatformForUrl,
} from "@/lib/media-url";
import { getPlatformAdapter } from "@/lib/platforms/server-registry";
import { validateSupportedUrl } from "@/lib/platforms/validation";
import { resolveReddit } from "@/resolver/reddit";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.REDDIT_CLIENT_ID;
  delete process.env.REDDIT_CLIENT_SECRET;
  delete process.env.REDDIT_USER_AGENT;
});

describe("Reddit isolated adapter foundation", () => {
  it("validates reddit.com and redd.it post URLs", () => {
    expect(
      validateSupportedUrl(
        "https://www.reddit.com/r/test/comments/abc123/example_post/",
      ),
    ).toMatchObject({
      ok: true,
      platform: "reddit",
      contentType: "post",
      normalizedUrl: "https://www.reddit.com/comments/abc123/",
    });

    expect(
      validateSupportedUrl("https://redd.it/abc123"),
    ).toMatchObject({
      ok: true,
      platform: "reddit",
    });
  });

  it("rejects subreddit-only URLs", () => {
    expect(
      validateSupportedUrl("https://www.reddit.com/r/videos/"),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-002",
    });
  });

  it("keeps Reddit media CDN access platform-scoped", () => {
    expect(
      isAllowedRedditMediaUrl(
        "https://v.redd.it/example/DASH_1080.mp4",
      ),
    ).toBe(true);
    expect(
      isAllowedRedditMediaUrl(
        "https://i.redd.it/example.jpg",
      ),
    ).toBe(true);
    expect(
      mediaPlatformForUrl("https://i.redd.it/example.jpg"),
    ).toBe("reddit");
    expect(
      isAllowedRedditMediaUrl(
        "https://video.twimg.com/example.mp4",
      ),
    ).toBe(false);
  });

  it("stays disabled without authorized Reddit API configuration", async () => {
    expect(getPlatformAdapter("reddit").health()).toMatchObject({
      platform: "reddit",
      status: "disabled",
    });

    expect(
      await resolveReddit("https://www.reddit.com/comments/abc123/"),
    ).toMatchObject({
      ok: false,
      code: "SM-RD-106",
    });
  });

  it("normalizes an authorized Reddit-hosted video response", async () => {
    process.env.REDDIT_CLIENT_ID = "client-id";
    process.env.REDDIT_CLIENT_SECRET = "client-secret";
    process.env.REDDIT_USER_AGENT = "web:SaveMingo:test";

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input) => {
        const url = String(input);

        if (url.includes("/api/v1/access_token")) {
          return new Response(
            JSON.stringify({
              access_token: "token",
              token_type: "bearer",
              expires_in: 3600,
              scope: "read",
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            },
          );
        }

        return new Response(
          JSON.stringify({
            data: {
              children: [
                {
                  kind: "t3",
                  data: {
                    id: "abc123",
                    is_video: true,
                    secure_media: {
                      reddit_video: {
                        fallback_url:
                          "https://v.redd.it/example/DASH_1080.mp4?source=fallback",
                        width: 1920,
                        height: 1080,
                        is_gif: false,
                      },
                    },
                  },
                },
              ],
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      });

    const result = await resolveReddit(
      "https://www.reddit.com/comments/abc123/",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "reddit-api",
      strategy: "official-oauth-api",
      contentType: "video",
    });

    if (result.ok) {
      expect(result.media[0]).toMatchObject({
        type: "video",
        width: 1920,
        height: 1080,
      });
    }

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
