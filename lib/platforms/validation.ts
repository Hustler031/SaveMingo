import { ERROR_CODES } from "@/lib/errors";
import type { Platform } from "@/lib/downloader/types";
import { detectPlatformFromUrl } from "@/lib/platforms/detect";
import { validateInstagramUrl } from "@/lib/platforms/instagram/validation";
import { validatePinterestUrl } from "@/lib/platforms/pinterest/validation";
import { validateRedditUrl } from "@/lib/platforms/reddit/validation";
import { validateTikTokUrl } from "@/lib/platforms/tiktok/validation";
import type { PlatformValidationResult } from "@/lib/platforms/types";
import { validateXUrl } from "@/lib/platforms/x/validation";

export function validateSupportedUrl(
  rawValue: string,
  expectedPlatform?: Platform,
): PlatformValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a supported public link to continue.",
    };
  }

  const detected = detectPlatformFromUrl(value);

  if (!detected) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message:
        "SaveMingo currently supports public Instagram, X, Pinterest, Reddit, and TikTok links.",
    };
  }

  if (expectedPlatform && detected !== expectedPlatform) {
    const expectedName =
      expectedPlatform === "instagram"
        ? "Instagram"
        : expectedPlatform === "x"
          ? "X or Twitter"
          : expectedPlatform === "pinterest"
            ? "Pinterest"
            : expectedPlatform === "reddit"
              ? "Reddit"
              : "TikTok";

    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: `Paste a ${expectedName} link on this page.`,
    };
  }

  if (detected === "instagram") return validateInstagramUrl(value);
  if (detected === "x") return validateXUrl(value);
  if (detected === "pinterest") return validatePinterestUrl(value);
  if (detected === "reddit") return validateRedditUrl(value);

  return validateTikTokUrl(value);
}
