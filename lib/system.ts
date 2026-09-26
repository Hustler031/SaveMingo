export const APP_NAME = "SaveMingo";
export const APP_VERSION = "0.2.0";
export const BUILD_PHASE = "SM-003-instagram-resolver";

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
      instagramResolver: "healthy" as ComponentStatus,
    },
  };
}
