import type { Platform } from "@/lib/downloader/types";

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
  "m.instagram.com",
  "instagr.am",
  "www.instagr.am",
]);

const X_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "mobile.x.com",
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
]);

const PINTEREST_HOSTS = new Set([
  "pinterest.com",
  "www.pinterest.com",
  "in.pinterest.com",
  "uk.pinterest.com",
  "ca.pinterest.com",
  "au.pinterest.com",
  "pin.it",
  "www.pin.it",
]);

const REDDIT_HOSTS = new Set([
  "reddit.com",
  "www.reddit.com",
  "old.reddit.com",
  "new.reddit.com",
  "redd.it",
  "www.redd.it",
  "v.redd.it",
  "i.redd.it",
]);

export function isInstagramHost(hostname: string) {
  return INSTAGRAM_HOSTS.has(hostname.toLowerCase());
}

export function isXHost(hostname: string) {
  return X_HOSTS.has(hostname.toLowerCase());
}

export function isPinterestHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    PINTEREST_HOSTS.has(host) ||
    host.endsWith(".pinterest.com")
  );
}

export function isRedditHost(hostname: string) {
  return REDDIT_HOSTS.has(hostname.toLowerCase());
}

export function detectPlatformFromUrl(rawValue: string): Platform | null {
  try {
    const parsed = new URL(rawValue.trim());

    if (isInstagramHost(parsed.hostname)) return "instagram";
    if (isXHost(parsed.hostname)) return "x";
    if (isPinterestHost(parsed.hostname)) return "pinterest";
    if (isRedditHost(parsed.hostname)) return "reddit";

    return null;
  } catch {
    return null;
  }
}
