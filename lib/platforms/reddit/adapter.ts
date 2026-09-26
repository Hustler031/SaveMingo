import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolveReddit } from "@/resolver/reddit";

export const redditAdapter: PlatformAdapter = {
  platform: "reddit",
  unexpectedErrorCode: ERROR_CODES.REDDIT_RESOLVER_FAILED,

  async resolve(input) {
    return resolveReddit(input.normalizedUrl);
  },

  health() {
    return {
      platform: "reddit",
      status: "healthy",
      providers: ["reddit-public-json"],
      capabilities: {
        video: "implemented-video-track",
        photo: "implemented",
        gallery: "implemented",
        gif: "implemented",
        soundMerge: "not-yet-implemented",
        mediaDelivery: "implemented",
      },
    };
  },
};
