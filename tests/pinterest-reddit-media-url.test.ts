import { describe, expect, it } from "vitest";
import {
  isAllowedPinterestMediaUrl,
  isAllowedRedditMediaUrl,
  mediaPlatformForUrl,
} from "@/lib/media-url";

describe("Pinterest and Reddit media allow-lists", () => {
  it("allows Pinterest CDN media", () => {
    expect(
      isAllowedPinterestMediaUrl(
        "https://i.pinimg.com/originals/aa/bb/cc/example.jpg",
      ),
    ).toBe(true);

    expect(
      isAllowedPinterestMediaUrl(
        "https://v1.pinimg.com/videos/mc/720p/example.mp4",
      ),
    ).toBe(true);
  });

  it("allows Reddit-hosted media", () => {
    expect(isAllowedRedditMediaUrl("https://i.redd.it/example.jpg")).toBe(true);
    expect(
      isAllowedRedditMediaUrl(
        "https://v.redd.it/example/DASH_720.mp4",
      ),
    ).toBe(true);
  });

  it("keeps media ownership explicit", () => {
    expect(
      mediaPlatformForUrl("https://i.pinimg.com/originals/example.jpg"),
    ).toBe("pinterest");

    expect(mediaPlatformForUrl("https://preview.redd.it/example.jpg")).toBe(
      "reddit",
    );
  });
});
