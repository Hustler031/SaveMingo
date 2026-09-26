import { ERROR_CODES } from "@/lib/errors";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { resolvePinterest } from "@/resolver/pinterest";

export const pinterestAdapter: PlatformAdapter = {
  platform: "pinterest",
  unexpectedErrorCode: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
  resolve(input) {
    return resolvePinterest(input.normalizedUrl);
  },
  health() {
    const configured = Boolean(process.env.PINTEREST_ACCESS_TOKEN);
    return {
      platform: "pinterest",
      status: configured ? "healthy" : "disabled",
      providers: ["pinterest-api"],
      capabilities: {
        pinMetadata: configured ? "configured" : "access-required",
        image: configured ? "implemented" : "access-required",
        video: configured ? "restricted-api-access-dependent" : "access-required",
      },
    };
  },
};
