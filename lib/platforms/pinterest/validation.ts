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

export function extractPinterestPinId(sourceUrl: string) {
  try {
    const parts = new URL(sourceUrl).pathname.split("/").filter(Boolean);
    const pinIndex = parts.findIndex((part) => part.toLowerCase() === "pin");
    const candidate = pinIndex >= 0 ? parts[pinIndex + 1] : undefined;
    return candidate && /^\d+$/.test(candidate) ? candidate : undefined;
  } catch {
    return undefined;
  }
}

export function validatePinterestUrl(rawValue: string): PinterestValidationResult {
  const value = rawValue.trim();

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "That doesn’t look like a complete Pinterest link.",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol) || !isPinterestHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a standard pinterest.com Pin link.",
    };
  }

  const pinId = extractPinterestPinId(parsed.toString());
  if (!pinId) {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message: "Paste one public Pinterest Pin URL containing /pin/<id>/.",
    };
  }

  return {
    ok: true,
    platform: "pinterest",
    normalizedUrl: `https://www.pinterest.com/pin/${pinId}/`,
    contentType: "pin",
  };
}
