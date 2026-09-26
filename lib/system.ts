import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

export const APP_NAME = "SaveMingo";
export const APP_VERSION = "0.4.0";
export const BUILD_PHASE = "SM-005-reliability";

export type ComponentStatus = "healthy" | "not_configured" | "degraded";

export function systemHealth() {
  const sentryConfigured = Boolean(process.env.SENTRY_DSN);

  return {
    app: APP_NAME,
    version: APP_VERSION,
    phase: BUILD_PHASE,
    status: "healthy" as const,
    components: {
      web: "healthy" as ComponentStatus,
      api: "healthy" as ComponentStatus,
      instagramResolver: "healthy" as ComponentStatus,
      structuredLogs: "healthy" as ComponentStatus,
      sentry: sentryConfigured
        ? ("healthy" as ComponentStatus)
        : ("not_configured" as ComponentStatus),
    },
    reliability: {
      rateLimiting: {
        mode: "best-effort-instance",
        resolvePerMinute: RELIABILITY_POLICY.resolve.rateLimit,
        mediaPerMinute: RELIABILITY_POLICY.media.rateLimit,
      },
      timeoutsMs: {
        instagram: RELIABILITY_POLICY.instagram.fetchTimeoutMs,
        media: RELIABILITY_POLICY.media.fetchTimeoutMs,
      },
    },
  };
}
