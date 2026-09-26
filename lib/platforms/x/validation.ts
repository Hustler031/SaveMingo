import { ERROR_CODES } from "@/lib/errors";
import { isXHost } from "@/lib/platforms/detect";

export type XValidationResult =
  | {
      ok: true;
      platform: "x";
      normalizedUrl: string;
      contentType: "post";
    }
  | {
      ok: false;
      code: typeof ERROR_CODES.INVALID_URL | typeof ERROR_CODES.UNSUPPORTED_URL;
      message: string;
    };

function statusParts(pathname: string) {
  const parts = pathname
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (
    parts.length >= 3 &&
    parts[1]?.toLowerCase() === "status" &&
    /^\d+$/.test(parts[2] ?? "")
  ) {
    return {
      handle: parts[0],
      id: parts[2],
    };
  }

  if (
    parts.length >= 3 &&
    parts[0]?.toLowerCase() === "i" &&
    parts[1]?.toLowerCase() === "web" &&
    parts[2]?.toLowerCase() === "status" &&
    /^\d+$/.test(parts[3] ?? "")
  ) {
    return {
      handle: "i/web",
      id: parts[3],
    };
  }

  return null;
}

export function validateXUrl(rawValue: string): XValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste an X post link to continue.",
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
      message: "Only standard X or Twitter web links are supported.",
    };
  }

  if (!isXHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "This doesn’t appear to be an X or Twitter link.",
    };
  }

  const status = statusParts(parsed.pathname);

  if (!status) {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste a public X post link containing /status/ — profile, search, and home-page links aren’t supported.",
    };
  }

  parsed.protocol = "https:";
  parsed.hostname = "x.com";
  parsed.hash = "";
  parsed.search = "";

  return {
    ok: true,
    platform: "x",
    normalizedUrl: parsed.toString(),
    contentType: "post",
  };
}

export function extractXStatusId(sourceUrl: string) {
  try {
    const parsed = new URL(sourceUrl);
    return statusParts(parsed.pathname)?.id;
  } catch {
    return undefined;
  }
}
