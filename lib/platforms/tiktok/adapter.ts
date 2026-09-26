import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolveTikTok } from "@/resolver/tiktok";

export const tiktokAdapter: PlatformAdapter = {
  platform: "tiktok",
  unexpectedErrorCode: ERROR_CODES.TIKTOK_RESOLVER_FAILED,

  async resolve(input) {
    return resolveTikTok(input.normalizedUrl);
  },

  health() {
    return {
      platform: "tiktok",
      status: "healthy",
      providers: ["tiktok-public-page"],
      capabilities: {
        video: "implemented",
        photo: "implemented",
        slideshow: "implemented",
        shortLinks: "implemented",
        noWatermark: "best-effort-when-public-source-allows",
        mp3: "not-yet-implemented",
        mediaDelivery: "implemented",
      },
    };
  },
};
