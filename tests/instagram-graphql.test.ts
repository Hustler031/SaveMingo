import { describe, expect, it } from "vitest";
import { normalizeGraphqlVideoItem } from "@/resolver/instagram/graphql-provider";

describe("Instagram GraphQL normalization", () => {
  it("selects the highest-resolution progressive video and image", () => {
    const result = normalizeGraphqlVideoItem(
      {
        code: "TEST",
        video_versions: [
          {
            url: "https://cdn.example/360.mp4",
            width: 360,
            height: 640,
          },
          {
            url: "https://cdn.example/1080.mp4",
            width: 1080,
            height: 1920,
          },
        ],
        image_versions2: {
          candidates: [
            {
              url: "https://cdn.example/preview-small.jpg",
              width: 320,
              height: 568,
            },
            {
              url: "https://cdn.example/preview-large.jpg",
              width: 1080,
              height: 1920,
            },
          ],
        },
      },
      "reel",
    );

    expect(result).toMatchObject({
      ok: true,
      provider: "graphql",
      contentType: "reel",
      strategy: "graphql-video-versions",
      media: [
        {
          type: "video",
          url: "https://cdn.example/1080.mp4",
          thumbnailUrl: "https://cdn.example/preview-large.jpg",
          width: 1080,
          height: 1920,
        },
      ],
    });
  });

  it("returns undefined when no progressive video is present", () => {
    expect(
      normalizeGraphqlVideoItem(
        {
          code: "PHOTO",
          image_versions2: {
            candidates: [
              {
                url: "https://cdn.example/photo.jpg",
                width: 1080,
                height: 1080,
              },
            ],
          },
        },
        "post",
      ),
    ).toBeUndefined();
  });
});
