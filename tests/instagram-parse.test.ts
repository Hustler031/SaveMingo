import { describe, expect, it } from "vitest";
import {
  extractMetaContent,
  parseInstagramPage,
} from "@/resolver/instagram/parse";

describe("Instagram page parser", () => {
  it("extracts Open Graph video metadata regardless of attribute order", () => {
    const html = [
      "<html><head>",
      '<meta content="https://cdn.example/video.mp4?x=1&amp;y=2" property="og:video:secure_url">',
      '<meta property="og:image" content="https://cdn.example/poster.jpg">',
      '<meta content="1080" property="og:video:width">',
      '<meta property="og:video:height" content="1920">',
      "</head></html>",
    ].join("");

    expect(parseInstagramPage(html)).toEqual({
      videoUrl: "https://cdn.example/video.mp4?x=1&y=2",
      imageUrl: "https://cdn.example/poster.jpg",
      width: 1080,
      height: 1920,
      strategy: "open-graph",
    });
  });

  it("falls back to an embedded JSON video_url", () => {
    const html =
      '<script>{"video_url":"https:\\/\\/cdn.example\\/clip.mp4?x=1\\u0026y=2"}</script>';

    expect(parseInstagramPage(html)).toMatchObject({
      videoUrl: "https://cdn.example/clip.mp4?x=1&y=2",
      strategy: "embedded-video-url",
    });
  });

  it("returns image metadata when no video is exposed", () => {
    const html =
      '<meta property="og:image" content="https://cdn.example/photo.jpg">';

    expect(parseInstagramPage(html)).toEqual({
      videoUrl: undefined,
      imageUrl: "https://cdn.example/photo.jpg",
      width: undefined,
      height: undefined,
      strategy: undefined,
    });
  });

  it("can read name-based metadata", () => {
    const html =
      '<meta name="twitter:player:stream" content="https://cdn.example/v.mp4">';

    expect(extractMetaContent(html, ["twitter:player:stream"])).toBe(
      "https://cdn.example/v.mp4",
    );
  });

  it("selects video_versions from the exact shortcode and highest resolution", () => {
    const payload = {
      unrelated: {
        code: "OTHER",
        video_versions: [
          {
            url: "https://cdn.example/wrong.mp4",
            width: 2160,
            height: 3840,
          },
        ],
      },
      target: {
        code: "DH56yy7p3lZ",
        video_versions: [
          {
            url: "https://cdn.example/target-small.mp4?x=1&y=2",
            width: 360,
            height: 640,
          },
          {
            url: "https://cdn.example/target-best.mp4?x=1&y=2",
            width: 1080,
            height: 1920,
          },
        ],
      },
    };

    const html =
      '<script type="application/json">' +
      JSON.stringify(payload) +
      "</script>";

    expect(parseInstagramPage(html, "DH56yy7p3lZ")).toMatchObject({
      videoUrl: "https://cdn.example/target-best.mp4?x=1&y=2",
      width: 1080,
      height: 1920,
      strategy: "video_versions",
    });
  });

  it("uses the bounded raw Relay fallback when a script is not strict JSON", () => {
    const html = [
      "<script>",
      'window.__data={"code":"DH56yy7p3lZ","video_versions":',
      '[{"url":"https://cdn.example/raw-360.mp4","width":360,"height":640},',
      '{"url":"https://cdn.example/raw-720.mp4","width":720,"height":1280}]};',
      "</script>",
    ].join("");

    expect(parseInstagramPage(html, "DH56yy7p3lZ")).toMatchObject({
      videoUrl: "https://cdn.example/raw-720.mp4",
      width: 720,
      height: 1280,
      strategy: "video_versions",
    });
  });
});
