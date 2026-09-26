import { ERROR_CODES } from "@/lib/errors";
import { isTikTokHost } from "@/lib/platforms/detect";

export type TikTokValidationResult =
  | {
      ok: true;
      platform: "tiktok";
      normalizedUrl: string;
      contentType: "video" | "photo" | "unknown";
    }
  | {
      ok: false;
      code: typeof ERROR_CODES.INVALID_URL | typeof ERROR_CODES.UNSUPPORTED_URL;
      message: string;
    };

function contentTypeFromPath(pathname: string) {
  const lower = pathname.toLowerCase();

  if (/\/@[^/]+\/video\/\d+/.test(lower)) return "video" as const;
  if (/\/@[^/]+\/photo\/\d+/.test(lower)) return "photo" as const;

  return "unknown" as const;
}

export function validateTikTokUrl(rawValue: string): TikTokValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a TikTok post link to continue.",
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
      message: "Only standard TikTok web links are supported.",
    };
  }

  if (!isTikTokHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "This doesn’t appear to be a TikTok link.",
    };
  }

  const host = parsed.hostname.toLowerCase();
  const shortLink =
    host === "vm.tiktok.com" ||
    host === "vt.tiktok.com" ||
    host === "v.tiktok.com" ||
    parsed.pathname.toLowerCase().startsWith("/t/");

  const contentType = contentTypeFromPath(parsed.pathname);

  if (!shortLink && contentType === "unknown") {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste a public TikTok video or photo-post link — profile, search, and home-page links aren’t supported.",
    };
  }

  parsed.protocol = "https:";
  parsed.hash = "";

  return {
    ok: true,
    platform: "tiktok",
    normalizedUrl: parsed.toString(),
    contentType,
  };
}
