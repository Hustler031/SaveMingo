export const APP_NAME = "SaveMingo";
export const APP_VERSION = "0.1.0";
export const BUILD_PHASE = "SM-001-foundation";

export type ComponentStatus = "healthy" | "not_configured" | "degraded";

export function systemHealth() {
  return {
    app: APP_NAME,
    version: APP_VERSION,
    phase: BUILD_PHASE,
    status: "healthy" as const,
    components: {
      web: "healthy" as ComponentStatus,
      api: "healthy" as ComponentStatus,
      instagramResolver: "not_configured" as ComponentStatus,
    },
  };
}
