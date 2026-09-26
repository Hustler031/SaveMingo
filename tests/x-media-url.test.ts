import { describe, expect, it } from "vitest";
import {
  isAllowedMediaUrl,
  isAllowedXMediaUrl,
  mediaPlatformForUrl,
} from "@/lib/media-url";

describe("X media URL allow-list", () => {
  it("allows X photo and video CDN hosts", () => {
    expect(
      isAllowedXMediaUrl(
        "https://pbs.twimg.com/media/example.jpg",
      ),
    ).toBe(true);

    expect(
      isAllowedXMediaUrl(
        "https://video.twimg.com/ext_tw_video/example/vid/1280x720/file.mp4",
      ),
    ).toBe(true);
  });

  it("identifies the owning platform", () => {
    expect(
      mediaPlatformForUrl(
        "https://video.twimg.com/ext_tw_video/example/file.mp4",
      ),
    ).toBe("x");

    expect(
      mediaPlatformForUrl(
        "https://scontent.cdninstagram.com/v/t50/video.mp4",
      ),
    ).toBe("instagram");
  });

  it.each([
    "http://video.twimg.com/file.mp4",
    "https://evilvideo.twimg.com.example/file.mp4",
    "https://twimg.com.evil.example/file.mp4",
    "https://127.0.0.1/file.mp4",
    "https://user:pass@video.twimg.com/file.mp4",
    "https://video.twimg.com:8443/file.mp4",
  ])("rejects unsafe X media URL %s", (value) => {
    expect(isAllowedXMediaUrl(value)).toBe(false);
    expect(isAllowedMediaUrl(value)).toBe(false);
  });
});
