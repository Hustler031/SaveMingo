import { describe, expect, it } from "vitest";
import {
  isAllowedMediaUrl,
  isAllowedTikTokMediaUrl,
  mediaPlatformForUrl,
} from "@/lib/media-url";

describe("TikTok media URL allow-list", () => {
  it("allows known TikTok CDN roots", () => {
    expect(
      isAllowedTikTokMediaUrl(
        "https://v16.tiktokcdn.com/video/example.mp4",
      ),
    ).toBe(true);

    expect(
      isAllowedTikTokMediaUrl(
        "https://p16-sign-va.tiktokcdn.com/tos-maliva-p/example.jpeg",
      ),
    ).toBe(true);

    expect(
      isAllowedTikTokMediaUrl(
        "https://p16.muscdn.com/obj/example.jpeg",
      ),
    ).toBe(true);
  });

  it("identifies TikTok media ownership", () => {
    expect(
      mediaPlatformForUrl(
        "https://v16.tiktokcdn.com/video/example.mp4",
      ),
    ).toBe("tiktok");
  });

  it.each([
    "http://v16.tiktokcdn.com/video.mp4",
    "https://tiktokcdn.com.evil.example/video.mp4",
    "https://127.0.0.1/video.mp4",
    "https://user:pass@v16.tiktokcdn.com/video.mp4",
    "https://v16.tiktokcdn.com:8443/video.mp4",
  ])("rejects unsafe TikTok media URL %s", (value) => {
    expect(isAllowedTikTokMediaUrl(value)).toBe(false);
    expect(isAllowedMediaUrl(value)).toBe(false);
  });
});
