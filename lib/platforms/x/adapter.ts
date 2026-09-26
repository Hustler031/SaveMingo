import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolveX } from "@/resolver/x";

export const xAdapter: PlatformAdapter = {
  platform: "x",
  unexpectedErrorCode: ERROR_CODES.X_RESOLVER_FAILED,

  async resolve(input) {
    return resolveX(input.normalizedUrl);
  },

  health() {
    return {
      platform: "x",
      status: "healthy",
      providers: ["x-syndication"],
      capabilities: {
        video: "implemented",
        photo: "implemented",
        carousel: "implemented",
        gif: "implemented-as-video",
        mediaDelivery: "implemented",
      },
    };
  },
};
