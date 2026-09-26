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

export function extractRedditPostId(sourceUrl: string) {
  try {
    const parsed = new URL(sourceUrl);
    const host = parsed.hostname.toLowerCase();
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (host === "redd.it" || host === "www.redd.it") {
      const candidate = parts[0];
      return candidate && /^[a-z0-9]+$/i.test(candidate)
        ? candidate.toLowerCase()
        : undefined;
    }

    const commentsIndex = parts.findIndex(
      (part) => part.toLowerCase() === "comments",
    );
    const candidate =
      commentsIndex >= 0 ? parts[commentsIndex + 1] : undefined;

    return candidate && /^[a-z0-9]+$/i.test(candidate)
      ? candidate.toLowerCase()
      : undefined;
  } catch {
    return undefined;
  }
}

export function validateRedditUrl(rawValue: string): RedditValidationResult {
  const value = rawValue.trim();

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "That doesn’t look like a complete Reddit link.",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol) || !isRedditHost(parsed.hostname)) {
    return {
      ok: false,
      code: ERROR_CODES.INVALID_URL,
      message: "Paste a standard public Reddit post link.",
    };
  }

  const postId = extractRedditPostId(parsed.toString());
  if (!postId) {
    return {
      ok: false,
      code: ERROR_CODES.UNSUPPORTED_URL,
      message:
        "Paste one public Reddit post link — subreddit, profile, and home-page links aren’t supported.",
    };
  }

  return {
    ok: true,
    platform: "reddit",
    normalizedUrl: `https://www.reddit.com/comments/${postId}/`,
    contentType: "post",
  };
}
