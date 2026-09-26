import { ERROR_CODES } from "@/lib/errors";
import type { InstagramContentType } from "@/lib/downloader/types";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolveInstagram } from "@/resolver/instagram";

export const instagramAdapter: PlatformAdapter = {
  platform: "instagram",
  unexpectedErrorCode: ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,

  async resolve(input) {
    const providerResult = await resolveInstagram(
      input.normalizedUrl,
      input.contentType as InstagramContentType,
    );

    if (!providerResult.ok) return providerResult;

    return {
      ok: true,
      provider: providerResult.provider,
      strategy: providerResult.strategy,
      contentType: providerResult.contentType,
      media: providerResult.media,
    };
  },

  health() {
    return {
      platform: "instagram",
      status: "healthy",
      providers: ["public-page", "graphql"],
      capabilities: {
        reelVideo: "live-verified",
        videoPost: "implemented",
        photo: "implemented-unit-verified",
        carousel: "live-verified",
        mediaDelivery: "live-verified",
      },
    };
  },
};
