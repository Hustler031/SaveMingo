import type { Platform } from "@/lib/downloader/types";

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
  "instagr.am",
  "www.instagr.am",
]);

function isPinterestHostname(hostname: string) {
  const value = hostname.toLowerCase().replace(/\.$/, "");
  return value === "pinterest.com" || value.endsWith(".pinterest.com");
}

const X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
]);

export function isInstagramHost(hostname: string) {
  return INSTAGRAM_HOSTS.has(hostname.toLowerCase());
}

export function isPinterestHost(hostname: string) {
  return isPinterestHostname(hostname);
}

export function isXHost(hostname: string) {
  return X_HOSTS.has(hostname.toLowerCase());
}

export function detectPlatformFromUrl(rawValue: string): Platform | null {
  try {
    const parsed = new URL(rawValue.trim());

    if (isInstagramHost(parsed.hostname)) return "instagram";
    if (isXHost(parsed.hostname)) return "x";
    if (isPinterestHost(parsed.hostname)) return "pinterest";

    return null;
  } catch {
    return null;
  }
}
