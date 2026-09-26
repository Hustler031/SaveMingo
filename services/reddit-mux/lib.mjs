const ALLOWED_REDDIT_MEDIA_HOSTS = new Set([
  "v.redd.it",
]);

export function isAllowedRedditMuxUrl(raw) {
  try {
    const url = new URL(raw);

    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    if (url.port && url.port !== "443") return false;

    return ALLOWED_REDDIT_MEDIA_HOSTS.has(
      url.hostname.toLowerCase().replace(/\.$/, ""),
    );
  } catch {
    return false;
  }
}

export function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attrValue(tag, name) {
  const quoted = tag.match(
    new RegExp(name + "\\s*=\\s*[\"']([^\"']+)[\"']", "i"),
  );

  return quoted?.[1];
}

function audioAdaptationBlocks(xml) {
  const blocks = [];

  for (const match of xml.matchAll(
    /<AdaptationSet\b([^>]*)>([\s\S]*?)<\/AdaptationSet>/gi,
  )) {
    const attrs = match[1] ?? "";
    const body = match[2] ?? "";
    const contentType = attrValue(attrs, "contentType")?.toLowerCase();
    const mimeType = attrValue(attrs, "mimeType")?.toLowerCase();

    if (
      contentType === "audio" ||
      mimeType?.startsWith("audio/") ||
      /mimeType\s*=\s*["']audio\//i.test(body)
    ) {
      blocks.push(body);
    }
  }

  return blocks;
}

export function selectBestDashAudioUrl(xml, manifestUrl) {
  const candidates = [];

  for (const block of audioAdaptationBlocks(xml)) {
    for (const match of block.matchAll(
      /<Representation\b([^>]*)>([\s\S]*?)<\/Representation>/gi,
    )) {
      const attrs = match[1] ?? "";
      const body = match[2] ?? "";
      const baseMatch = body.match(/<BaseURL[^>]*>([\s\S]*?)<\/BaseURL>/i);

      if (!baseMatch?.[1]) continue;

      const bandwidth = Number.parseInt(
        attrValue(attrs, "bandwidth") ?? "0",
        10,
      );

      try {
        const url = new URL(
          decodeXml(baseMatch[1].trim()),
          manifestUrl,
        );

        if (!isAllowedRedditMuxUrl(url.toString())) continue;

        candidates.push({
          bandwidth: Number.isFinite(bandwidth) ? bandwidth : 0,
          url: url.toString(),
        });
      } catch {
        // Ignore malformed representation URLs.
      }
    }

    if (candidates.length === 0) {
      const baseMatch = block.match(/<BaseURL[^>]*>([\s\S]*?)<\/BaseURL>/i);

      if (baseMatch?.[1]) {
        try {
          const url = new URL(
            decodeXml(baseMatch[1].trim()),
            manifestUrl,
          );

          if (isAllowedRedditMuxUrl(url.toString())) {
            candidates.push({
              bandwidth: 0,
              url: url.toString(),
            });
          }
        } catch {
          // Ignore malformed adaptation URL.
        }
      }
    }
  }

  return candidates
    .sort((a, b) => b.bandwidth - a.bandwidth)[0]?.url;
}

export function safeOutputName(raw) {
  const value = String(raw ?? "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[._-]+/, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return value || "reddit-video-with-sound";
}
