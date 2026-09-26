import { describe, expect, it } from "vitest";
import {
  extensionForContentType,
  isAllowedInstagramMediaUrl,
  safeMediaFilenameBase,
} from "@/lib/media-url";

describe("Instagram media URL allow-list", () => {
  it("allows Instagram CDN subdomains", () => {
    expect(
      isAllowedInstagramMediaUrl(
        "https://scontent.cdninstagram.com/v/t50/video.mp4?x=1",
      ),
    ).toBe(true);
  });

  it("allows Meta fbcdn subdomains", () => {
    expect(
      isAllowedInstagramMediaUrl(
        "https://instagram.fhyd14-1.fna.fbcdn.net/v/t51/photo.jpg",
      ),
    ).toBe(true);
  });

  it.each([
    "http://scontent.cdninstagram.com/video.mp4",
    "https://evilcdninstagram.com/video.mp4",
    "https://cdninstagram.com.evil.example/video.mp4",
    "https://127.0.0.1/video.mp4",
    "https://localhost/video.mp4",
    "https://user:pass@scontent.cdninstagram.com/video.mp4",
    "https://scontent.cdninstagram.com:8443/video.mp4",
  ])("rejects unsafe media URL %s", (value) => {
    expect(isAllowedInstagramMediaUrl(value)).toBe(false);
  });
});

describe("media download helpers", () => {
  it("sanitizes filenames", () => {
    expect(safeMediaFilenameBase("../../my reel 😎 01")).toBe(
      "..-..-my-reel-01",
    );
  });

  it("maps known content types to safe extensions", () => {
    expect(extensionForContentType("video/mp4")).toBe("mp4");
    expect(extensionForContentType("image/jpeg; charset=binary")).toBe("jpg");
    expect(extensionForContentType("text/html")).toBe("bin");
  });
});
