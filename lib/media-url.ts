const ALLOWED_MEDIA_ROOTS = ["cdninstagram.com", "fbcdn.net"] as const;

export function isAllowedInstagramMediaUrl(raw: string) {
  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") {
    return false;
  }

  if (url.username || url.password) {
    return false;
  }

  if (url.port && url.port !== "443") {
    return false;
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

  return ALLOWED_MEDIA_ROOTS.some(
    (root) => hostname === root || hostname.endsWith("." + root),
  );
}

export function safeMediaFilenameBase(raw: string | null) {
  const fallback = "savemingo-media";

  if (!raw) {
    return fallback;
  }

  const value = raw
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    // Remove traversal/hidden-file style punctuation from the beginning after
    // unsafe characters have already been normalized into separators.
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
    default:
      return "bin";
  }
}
