import { describe, expect, it } from "vitest";
import { validateSupportedUrl } from "@/lib/downloader/validation";

describe("Pinterest and Reddit URL validation", () => {
  it("accepts a Pinterest pin URL", () => {
    expect(
      validateSupportedUrl("https://www.pinterest.com/pin/123456789012345678/"),
    ).toMatchObject({
      ok: true,
      platform: "pinterest",
      contentType: "pin",
    });
  });

  it("accepts a pin.it share URL", () => {
    expect(validateSupportedUrl("https://pin.it/AbCdEf123")).toMatchObject({
      ok: true,
      platform: "pinterest",
    });
  });

  it("accepts a Reddit comments URL", () => {
    expect(
      validateSupportedUrl(
        "https://www.reddit.com/r/videos/comments/abc123/example/",
      ),
    ).toMatchObject({
      ok: true,
      platform: "reddit",
      contentType: "post",
    });
  });

  it("accepts a redd.it short URL", () => {
    expect(validateSupportedUrl("https://redd.it/abc123")).toMatchObject({
      ok: true,
      platform: "reddit",
    });
  });

  it("keeps platform-specific pages isolated", () => {
    expect(
      validateSupportedUrl(
        "https://www.pinterest.com/pin/123456789012345678/",
        "reddit",
      ),
    ).toMatchObject({ ok: false, code: "SM-URL-001" });

    expect(
      validateSupportedUrl(
        "https://www.reddit.com/r/videos/comments/abc123/example/",
        "pinterest",
      ),
    ).toMatchObject({ ok: false, code: "SM-URL-001" });
  });
});
