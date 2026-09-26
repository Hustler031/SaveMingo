type LogLevel = "info" | "warn" | "error";

export type LogPayload = Record<string, unknown>;

export function releaseContext() {
  const rawSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
  const environment =
    process.env.VERCEL_ENV?.trim() ||
    process.env.NODE_ENV ||
    "development";

  return {
    environment,
    release: rawSha ? rawSha.slice(0, 12) : "local",
    region: process.env.VERCEL_REGION?.trim() || "local",
  };
}

export function structuredLog(
  service: string,
  level: LogLevel,
  payload: LogPayload,
) {
  const entry = JSON.stringify({
    service,
    ...releaseContext(),
    ...payload,
  });

  if (level === "error") {
    console.error(entry);
  } else if (level === "warn") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}
