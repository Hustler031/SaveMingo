import { ERROR_CODES } from "@/lib/errors";
import { isRedditHost } from "@/lib/platforms/detect";

export type RedditValidationResult =
  | {
      ok: true;
      platform: "reddit";
      normalizedUrl: string;
      contentType: "post";
    }
  | {
      ok: false;
      code: typeof ERROR_CODES.INVALID_URL | typeof ERROR_CODES.UNSUPPORTED_URL;
      message: string;
    };

function looksLikeRedditPost(parsed: URL) {
  const host = parsed.hostname.toLowerCase();

  if (host === "redd.it" || host === "www.redd.it") {
    return parsed.pathname.split("/").filter(Boolean).length >= 1;
  }

  if (host === "v.redd.it" || host === "i.redd.it") {
    return parsed.pathname.split("/").filter(Boolean).length >= 1;
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  return parts.includes("comments") || parts[0] === "s";
}

export function validateRedditUrl(rawValue: string): RedditValidationResult {
  const value = rawValue.trim();

  if (!value) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a Reddit post link to continue.",
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
      message: "Only standard Reddit web links are supported.",
    };
  }

  if (!isRedditHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "This doesn’t appear to be a Reddit link.",
    };
  }

  if (!looksLikeRedditPost(parsed)) {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste a public Reddit post link — subreddit, profile, search, and home-page links aren’t supported.",
    };
  }

  parsed.protocol = "https:";
  parsed.hash = "";

  return {
    ok: true,
    platform: "reddit",
    normalizedUrl: parsed.toString(),
    contentType: "post",
  };
}
