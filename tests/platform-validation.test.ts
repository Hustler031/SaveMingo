import { describe, expect, it } from "vitest";
import {
  extractXStatusId,
  validateSupportedUrl,
  validateXUrl,
} from "@/lib/downloader/validation";

describe("multi-platform URL validation", () => {
  it("detects Instagram without changing the existing contract", () => {
    const result = validateSupportedUrl(
      "https://www.instagram.com/reel/DH56yy7p3lZ/",
    );

    expect(result).toMatchObject({
      ok: true,
      platform: "instagram",
      contentType: "reel",
    });
  });

  it("accepts x.com status URLs", () => {
    const result = validateXUrl(
      "https://x.com/SpaceX/status/2000459900460347480?s=20",
    );

    expect(result).toMatchObject({
      ok: true,
      platform: "x",
      contentType: "post",
      normalizedUrl:
        "https://x.com/SpaceX/status/2000459900460347480",
    });
  });

  it("accepts legacy twitter.com status URLs", () => {
    const result = validateSupportedUrl(
      "https://twitter.com/SpaceX/status/2000459900460347480",
    );

    expect(result).toMatchObject({
      ok: true,
      platform: "x",
    });

    if (result.ok) {
      expect(result.normalizedUrl).toContain("https://x.com/");
      expect(extractXStatusId(result.normalizedUrl)).toBe(
        "2000459900460347480",
      );
    }
  });

  it("keeps platform-specific pages isolated", () => {
    expect(
      validateSupportedUrl(
        "https://x.com/SpaceX/status/2000459900460347480",
        "instagram",
      ),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-001",
    });

    expect(
      validateSupportedUrl(
        "https://www.instagram.com/reel/DH56yy7p3lZ/",
        "x",
      ),
    ).toMatchObject({
      ok: false,
      code: "SM-URL-001",
    });
  });

  it("rejects X profile URLs", () => {
    expect(validateXUrl("https://x.com/SpaceX")).toMatchObject({
      ok: false,
      code: "SM-URL-002",
    });
  });
});
