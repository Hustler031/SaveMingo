import type { Platform } from "@/lib/downloader/types";

const ALLOWED_MEDIA_ROOTS: Record<Platform, readonly string[]> = {
  instagram: ["cdninstagram.com", "fbcdn.net"],
  x: ["pbs.twimg.com", "video.twimg.com"],
  pinterest: ["pinimg.com"],
  reddit: ["redd.it", "redditmedia.com"],
  tiktok: [
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "tiktokcdn-eu.com",
    "tiktokv.com",
    "muscdn.com",
    "byteoversea.com",
    "byteoversea.net",
    "ibytedtos.com",
    "ibyteimg.com",
    "byteimg.com",
    "pstatp.com",
    "ipstatp.com",
    "tiktokcdn-com.akamaized.net",
  ],
};

function normalizedHttpsUrl(raw: string) {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;

  return url;
}

function hostMatchesRoot(hostname: string, root: string) {
  return hostname === root || hostname.endsWith("." + root);
}

export function mediaPlatformForUrl(raw: string): Platform | null {
  const url = normalizedHttpsUrl(raw);

  if (!url) return null;

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

  for (const [platform, roots] of Object.entries(
    ALLOWED_MEDIA_ROOTS,
  ) as Array<[Platform, readonly string[]]>) {
    if (roots.some((root) => hostMatchesRoot(hostname, root))) {
      return platform;
    }
  }

  return null;
}

export function isAllowedMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) !== null;
}

export function isAllowedInstagramMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) === "instagram";
}

export function isAllowedXMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) === "x";
}

export function isAllowedPinterestMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) === "pinterest";
}

export function isAllowedRedditMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) === "reddit";
}

export function isAllowedTikTokMediaUrl(raw: string) {
  return mediaPlatformForUrl(raw) === "tiktok";
}

export function safeMediaFilenameBase(raw: string | null) {
  const fallback = "savemingo-media";

  if (!raw) return fallback;

  const value = raw
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[._-]+/, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return value || fallback;
}

export function extensionForContentType(contentType: string | null) {
  const normalized = contentType?.split(";", 1)[0]?.trim().toLowerCase();

  switch (normalized) {
    case "video/mp4":
      return "mp4";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}
