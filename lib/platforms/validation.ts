import { ERROR_CODES } from "@/lib/errors";
import type { Platform } from "@/lib/downloader/types";
import { detectPlatformFromUrl } from "@/lib/platforms/detect";
import { validateInstagramUrl } from "@/lib/platforms/instagram/validation";
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
      message: "SaveMingo currently supports public Instagram and X post links.",
    };
  }

  if (expectedPlatform && detected !== expectedPlatform) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message:
        expectedPlatform === "instagram"
          ? "Paste an Instagram link on this page."
          : "Paste an X or Twitter post link on this page.",
    };
  }

  if (detected === "instagram") return validateInstagramUrl(value);
  return validateXUrl(value);
}
