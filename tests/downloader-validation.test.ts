import { describe, expect, it } from "vitest";
import { validateInstagramUrl } from "@/lib/downloader/validation";

describe("validateInstagramUrl", () => {
  it("accepts a public Reel URL", () => {
    const result = validateInstagramUrl(
      "https://www.instagram.com/reel/DH56yy7p3lZ/",
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.contentType).toBe("reel");
      expect(result.normalizedUrl).toContain("/reel/DH56yy7p3lZ/");
    }
  });

  it("accepts a /p/ post URL", () => {
    const result = validateInstagramUrl(
      "https://www.instagram.com/p/DH6e_dtC_sX/",
    );

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.contentType).toBe("post");
    }
  });

  it("rejects a non-Instagram URL", () => {
    const result = validateInstagramUrl("https://example.com/reel/test");

    expect(result).toMatchObject({
      ok: false,
      code: "SM-URL-001",
    });
  });

  it("rejects an Instagram profile URL", () => {
    const result = validateInstagramUrl("https://www.instagram.com/natgeo/");

    expect(result).toMatchObject({
      ok: false,
      code: "SM-URL-002",
    });
  });
});
