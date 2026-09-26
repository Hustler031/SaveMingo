import { ERROR_CODES } from "@/lib/errors";
import type { InstagramContentType } from "@/lib/downloader/types";
import { isInstagramHost } from "@/lib/platforms/detect";

export type InstagramValidationResult =
  | {
      ok: true;
      platform: "instagram";
      normalizedUrl: string;
      contentType: InstagramContentType;
    }
  | {
      ok: false;
      code: typeof ERROR_CODES.INVALID_URL | typeof ERROR_CODES.UNSUPPORTED_URL;
      message: string;
    };

function detectContentType(pathname: string): InstagramContentType {
  const parts = pathname
    .split("/")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  if (parts[0] === "reel" || parts[0] === "reels") return "reel";
  if (parts[0] === "tv") return "video";
  if (parts[0] === "p") return "post";
  if (parts[0] === "share" && parts[1] === "reel") return "reel";
  if (parts[0] === "share" && parts[1] === "p") return "post";

  return "unknown";
}

export function validateInstagramUrl(
  rawValue: string,
): InstagramValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste an Instagram link to continue.",
    };
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "That doesn’t look like a complete web link.",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Only standard Instagram web links are supported.",
    };
  }

  if (!isInstagramHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "This doesn’t appear to be an Instagram link.",
    };
  }

  const contentType = detectContentType(parsed.pathname);

  if (contentType === "unknown") {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste a public Instagram Reel, video, photo, or post link — profile and home-page links aren’t supported.",
    };
  }

  parsed.protocol = "https:";
  parsed.hash = "";

  return {
    ok: true,
    platform: "instagram",
    normalizedUrl: parsed.toString(),
    contentType,
  };
}
