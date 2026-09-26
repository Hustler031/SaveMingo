import { describe, expect, it } from "vitest";
import { normalizeGraphqlMediaItem } from "@/resolver/instagram/graphql-provider";

describe("Instagram GraphQL normalization", () => {
  it("selects the highest-resolution progressive video and image", () => {
    const result = normalizeGraphqlMediaItem(
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

  it("normalizes a single photo using the largest image candidate", () => {
    const result = normalizeGraphqlMediaItem(
      {
        code: "PHOTO",
        image_versions2: {
          candidates: [
            {
              url: "https://cdn.example/photo-320.jpg",
              width: 320,
              height: 320,
            },
            {
              url: "https://cdn.example/photo-1440.jpg",
              width: 1440,
              height: 1440,
            },
          ],
        },
      },
      "post",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "photo",
      strategy: "graphql-image-versions",
      media: [
        {
          id: "PHOTO",
          type: "image",
          url: "https://cdn.example/photo-1440.jpg",
          width: 1440,
          height: 1440,
        },
      ],
    });
  });

  it("preserves mixed carousel order and selects best candidate per child", () => {
    const result = normalizeGraphqlMediaItem(
      {
        code: "CAROUSEL",
        carousel_media: [
          {
            id: "image-1",
            image_versions2: {
              candidates: [
                {
                  url: "https://cdn.example/image-1-small.jpg",
                  width: 320,
                  height: 400,
                },
                {
                  url: "https://cdn.example/image-1-large.jpg",
                  width: 1080,
                  height: 1350,
                },
              ],
            },
          },
          {
            id: "video-2",
            video_versions: [
              {
                url: "https://cdn.example/video-2-360.mp4",
                width: 360,
                height: 640,
              },
              {
                url: "https://cdn.example/video-2-720.mp4",
                width: 720,
                height: 1280,
              },
            ],
            image_versions2: {
              candidates: [
                {
                  url: "https://cdn.example/video-2-cover.jpg",
                  width: 720,
                  height: 1280,
                },
              ],
            },
          },
          {
            id: "image-3",
            image_versions2: {
              candidates: [
                {
                  url: "https://cdn.example/image-3.jpg",
                  width: 1080,
                  height: 1080,
                },
              ],
            },
          },
        ],
      },
      "post",
    );

    expect(result).toMatchObject({
      ok: true,
      contentType: "carousel",
      strategy: "graphql-carousel",
      media: [
        {
          id: "image-1",
          type: "image",
          url: "https://cdn.example/image-1-large.jpg",
        },
        {
          id: "video-2",
          type: "video",
          url: "https://cdn.example/video-2-720.mp4",
          thumbnailUrl: "https://cdn.example/video-2-cover.jpg",
        },
        {
          id: "image-3",
          type: "image",
          url: "https://cdn.example/image-3.jpg",
        },
      ],
    });
  });

  it("refuses a partial carousel when a child has no usable media", () => {
    expect(
      normalizeGraphqlMediaItem(
        {
          code: "BROKEN",
          carousel_media: [
            {
              id: "image-1",
              image_versions2: {
                candidates: [
                  {
                    url: "https://cdn.example/image.jpg",
                    width: 1080,
                    height: 1080,
                  },
                ],
              },
            },
            {
              id: "missing-2",
            },
          ],
        },
        "post",
      ),
    ).toBeUndefined();
  });
});
