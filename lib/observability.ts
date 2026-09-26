import { APP_VERSION } from "@/lib/system";

export type LogLevel = "info" | "warn" | "error";

export function logOperationalEvent(
  service: string,
  level: LogLevel,
  event: string,
  data: Record<string, unknown> = {},
) {
  const entry = JSON.stringify({
    service,
    event,
    version: APP_VERSION,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    ...data,
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}
