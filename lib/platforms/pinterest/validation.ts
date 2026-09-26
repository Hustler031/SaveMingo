import { ERROR_CODES } from "@/lib/errors";
import { isPinterestHost } from "@/lib/platforms/detect";

export type PinterestValidationResult =
  | {
      ok: true;
      platform: "pinterest";
      normalizedUrl: string;
      contentType: "pin";
    }
  | {
      ok: false;
      code: typeof ERROR_CODES.INVALID_URL | typeof ERROR_CODES.UNSUPPORTED_URL;
      message: string;
    };

export function validatePinterestUrl(rawValue: string): PinterestValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a Pinterest pin link to continue.",
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
      message: "Only standard Pinterest web links are supported.",
    };
  }

  if (!isPinterestHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "This doesn’t appear to be a Pinterest link.",
    };
  }

  const pathname = parsed.pathname.toLowerCase();
  const shortLink = ["pin.it", "www.pin.it"].includes(parsed.hostname.toLowerCase());
  const pinPath = pathname.startsWith("/pin/") || /\/pin\/\d+/.test(pathname);

  if (!shortLink && !pinPath) {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste a public Pinterest pin link — profile, board, search, and home-page links aren’t supported.",
    };
  }

  parsed.protocol = "https:";
  parsed.hash = "";

  return {
    ok: true,
    platform: "pinterest",
    normalizedUrl: parsed.toString(),
    contentType: "pin",
  };
}
