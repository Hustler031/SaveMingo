import { afterEach, describe, expect, it, vi } from "vitest";
import {
  __resetRedditAnonymousSessionForTests,
  resolveReddit,
} from "@/resolver/reddit";

afterEach(() => {
  vi.restoreAllMocks();
  __resetRedditAnonymousSessionForTests();
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

function anonymousSessionResponse(extraCookie?: string) {
  return new Response("", {
    status: 200,
    headers: {
      "set-cookie":
        extraCookie ??
        "loid=loid-test; Path=/; Secure, token_v2=token-test; Path=/; Secure",
    },
  });
}

function videoPayload(hasAudio = true) {
  return redditPayload({
    secure_media: {
      reddit_video: {
        fallback_url: "https://v.redd.it/example/DASH_720.mp4",
        width: 1280,
        height: 720,
        is_gif: false,
        has_audio: hasAudio,
      },
    },
  });
}

describe("Reddit resolver", () => {
  it("follows /r/subreddit/s/share-id using the anonymous Reddit session", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (input, init) => {
        const url = String(input);

        if (url === "https://old.reddit.com/") {
          return anonymousSessionResponse(
            "loid=loid-share; Path=/; Secure",
          );
        }

        if (url.includes("/svc/shreddit/")) {
          return anonymousSessionResponse(
            "token_v2=token-share; Path=/; Secure",
          );
        }

        if (url.includes("/r/aww/s/nMEhJAPgdZ")) {
          const headers = new Headers(init?.headers);

          expect(headers.get("cookie")).toContain("loid=loid-share");
          expect(headers.get("cookie")).toContain("token_v2=token-share");

          return new Response(null, {
            status: 302,
            headers: {
              location:
                "https://www.reddit.com/r/aww/comments/abc123/example_post/",
            },
          });
        }

        if (url.includes("/r/aww/comments/abc123/example_post.json")) {
          const headers = new Headers(init?.headers);

          expect(headers.get("cookie")).toContain("loid=loid-share");
          expect(headers.get("cookie")).toContain("token_v2=token-share");

          return new Response(videoPayload(true), { status: 200 });
        }

        throw new Error("Unexpected fetch URL: " + url);
      });

    const result = await resolveReddit(
      "https://www.reddit.com/r/aww/s/nMEhJAPgdZ",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "reddit-public-json",
      contentType: "video",
    });

    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("normalizes a Reddit-hosted video track", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (
        url === "https://old.reddit.com/" ||
        url.includes("/svc/shreddit/")
      ) {
        return anonymousSessionResponse();
      }

      if (url.includes(".json")) {
        return new Response(videoPayload(true), { status: 200 });
      }

      throw new Error("Unexpected fetch URL: " + url);
    });

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
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (
        url === "https://old.reddit.com/" ||
        url.includes("/svc/shreddit/")
      ) {
        return anonymousSessionResponse();
      }

      if (url.includes(".json")) {
        return new Response(videoPayload(false), { status: 200 });
      }

      throw new Error("Unexpected fetch URL: " + url);
    });

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
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (
        url === "https://old.reddit.com/" ||
        url.includes("/svc/shreddit/")
      ) {
        return anonymousSessionResponse();
      }

      if (url.includes(".json")) {
        return new Response(
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
        );
      }

      throw new Error("Unexpected fetch URL: " + url);
    });

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

  it("does not mislabel a generic Reddit anonymous 403 as private", async () => {
    let jsonAttempts = 0;

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (
        url === "https://old.reddit.com/" ||
        url.includes("/svc/shreddit/")
      ) {
        return anonymousSessionResponse();
      }

      if (url.includes(".json")) {
        jsonAttempts += 1;

        return new Response(
          "<html><body>Blocked by network security</body></html>",
          {
            status: 403,
            headers: { "content-type": "text/html" },
          },
        );
      }

      throw new Error("Unexpected fetch URL: " + url);
    });

    const result = await resolveReddit(
      "https://www.reddit.com/r/videos/comments/abc123/example/",
    );

    expect(jsonAttempts).toBe(2);
    expect(result).toMatchObject({
      ok: false,
      provider: "reddit-public-json",
      code: "SM-RD-104",
      diagnostic: "anonymous-api-blocked",
    });
  });

  it("keeps actual private Reddit responses in the private error namespace", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (
        url === "https://old.reddit.com/" ||
        url.includes("/svc/shreddit/")
      ) {
        return anonymousSessionResponse();
      }

      if (url.includes(".json")) {
        return new Response(
          JSON.stringify({
            error: 403,
            reason: "private",
          }),
          {
            status: 403,
            headers: { "content-type": "application/json" },
          },
        );
      }

      throw new Error("Unexpected fetch URL: " + url);
    });

    const result = await resolveReddit(
      "https://www.reddit.com/r/private/comments/abc123/example/",
    );

    expect(result).toMatchObject({
      ok: false,
      provider: "reddit-public-json",
      code: "SM-RD-102",
      diagnostic: "upstream-access-restricted",
    });
  });
});
