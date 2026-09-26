import { releaseContext } from "@/lib/observability";

export const APP_NAME = "SaveMingo";
export const APP_VERSION = "0.4.0";
export const BUILD_PHASE = "SM-005-reliability-monitoring";

export type ComponentStatus = "healthy" | "not_configured" | "degraded";

export function systemHealth() {
  return {
    app: APP_NAME,
    version: APP_VERSION,
    phase: BUILD_PHASE,
    status: "healthy" as const,
    release: releaseContext(),
    components: {
      web: "healthy" as ComponentStatus,
      api: "healthy" as ComponentStatus,
      instagramResolver: "healthy" as ComponentStatus,
      mediaDelivery: "healthy" as ComponentStatus,
      errorMonitoring: process.env.SENTRY_DSN
        ? ("healthy" as ComponentStatus)
        : ("not_configured" as ComponentStatus),
    },
    capabilities: {
      instagram: {
        reelVideo: "live-verified",
        videoPost: "implemented",
        photo: "implemented-unit-verified",
        carousel: "live-verified",
        sameOriginDelivery: "live-verified",
      },
    },
  };
}
