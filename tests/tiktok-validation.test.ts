import { describe, expect, it } from "vitest";
import { validateSupportedUrl } from "@/lib/downloader/validation";

describe("TikTok URL validation", () => {
  it("accepts a full TikTok video URL", () => {
    expect(
      validateSupportedUrl(
        "https://www.tiktok.com/@creator/video/7420000000000000001",
      ),
    ).toMatchObject({
      ok: true,
      platform: "tiktok",
      contentType: "video",
    });
  });

  it("accepts a full TikTok photo URL", () => {
    expect(
      validateSupportedUrl(
        "https://www.tiktok.com/@creator/photo/7420000000000000002",
      ),
    ).toMatchObject({
      ok: true,
      platform: "tiktok",
      contentType: "photo",
    });
  });

  it("accepts vm.tiktok.com and vt.tiktok.com share links", () => {
    expect(
      validateSupportedUrl("https://vm.tiktok.com/ZMexample1/"),
    ).toMatchObject({
      ok: true,
      platform: "tiktok",
      contentType: "unknown",
    });

    expect(
      validateSupportedUrl("https://vt.tiktok.com/ZSexample2/"),
    ).toMatchObject({
      ok: true,
      platform: "tiktok",
      contentType: "unknown",
    });
  });

  it("rejects TikTok profile URLs", () => {
    expect(
      validateSupportedUrl("https://www.tiktok.com/@creator"),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-002",
    });
  });

  it("keeps TikTok-specific pages isolated", () => {
    expect(
      validateSupportedUrl(
        "https://www.tiktok.com/@creator/video/7420000000000000001",
        "instagram",
      ),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-001",
    });
  });
});
