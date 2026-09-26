import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolveReddit } from "@/resolver/reddit";

function configured() {
  return Boolean(
    process.env.REDDIT_CLIENT_ID &&
      process.env.REDDIT_CLIENT_SECRET &&
      process.env.REDDIT_USER_AGENT,
  );
}

export const redditAdapter: PlatformAdapter = {
  platform: "reddit",
  unexpectedErrorCode: ERROR_CODES.REDDIT_RESOLVER_FAILED,

  resolve(input) {
    return resolveReddit(input.normalizedUrl);
  },

  health() {
    const enabled = configured();

    return {
      platform: "reddit",
      status: enabled ? "healthy" : "disabled",
      providers: ["reddit-oauth-api"],
      capabilities: {
        publicPostMetadata: enabled ? "configured" : "access-required",
        images: enabled ? "implemented" : "access-required",
        galleries: enabled ? "implemented" : "access-required",
        video: enabled ? "video-source-only" : "access-required",
        audioMux: "not-implemented",
      },
    };
  },
};
