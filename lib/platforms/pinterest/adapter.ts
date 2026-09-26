import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolvePinterest } from "@/resolver/pinterest";

export const pinterestAdapter: PlatformAdapter = {
  platform: "pinterest",
  unexpectedErrorCode: ERROR_CODES.PINTEREST_RESOLVER_FAILED,

  async resolve(input) {
    return resolvePinterest(input.normalizedUrl);
  },

  health() {
    return {
      platform: "pinterest",
      status: "healthy",
      providers: ["pinterest-public-page"],
      capabilities: {
        video: "implemented",
        photo: "implemented",
        gif: "best-effort-as-video",
        ideaPin: "best-effort",
        mediaDelivery: "implemented",
      },
    };
  },
};
