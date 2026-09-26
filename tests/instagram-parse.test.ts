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
    });
  });

  it("falls back to an embedded JSON video_url", () => {
    const html =
      '<script>{"video_url":"https:\\/\\/cdn.example\\/clip.mp4?x=1\\u0026y=2"}</script>';

    expect(parseInstagramPage(html).videoUrl).toBe(
      "https://cdn.example/clip.mp4?x=1&y=2",
    );
  });

  it("returns image metadata when no video is exposed", () => {
    const html =
      '<meta property="og:image" content="https://cdn.example/photo.jpg">';

    expect(parseInstagramPage(html)).toEqual({
      videoUrl: undefined,
      imageUrl: "https://cdn.example/photo.jpg",
      width: undefined,
      height: undefined,
    });
  });

  it("can read name-based metadata", () => {
    const html =
      '<meta name="twitter:player:stream" content="https://cdn.example/v.mp4">';

    expect(extractMetaContent(html, ["twitter:player:stream"])).toBe(
      "https://cdn.example/v.mp4",
    );
  });
});
