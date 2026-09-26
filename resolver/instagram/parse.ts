export type ParsedInstagramPage = {
  videoUrl?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  strategy?: "video_versions" | "open-graph" | "embedded-video-url";
};

type Attributes = Record<string, string>;

type ParsedVideoVersion = {
  url: string;
  width?: number;
  height?: number;
};

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, decimal: string) =>
      String.fromCodePoint(Number.parseInt(decimal, 10)),
    );
}

function parseAttributes(tag: string): Attributes {
  const attributes: Attributes = {};
  const expression =
    /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/g;

  for (const match of tag.matchAll(expression)) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    attributes[name.toLowerCase()] = decodeHtmlEntities(
      doubleQuoted ?? singleQuoted ?? unquoted ?? "",
    );
  }

  return attributes;
}

export function extractMetaContent(html: string, keys: string[]) {
  const wanted = new Set(keys.map((key) => key.toLowerCase()));

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const identifier = (
      attributes.property ??
      attributes.name ??
      attributes.itemprop ??
      ""
    ).toLowerCase();

    if (wanted.has(identifier) && attributes.content) {
      return attributes.content;
    }
  }

  return undefined;
}

function extractJsonVideoUrl(html: string) {
  const patterns = [
    /"video_url"\s*:\s*"((?:\\.|[^"\\])*)"/i,
    /"contentUrl"\s*:\s*"((?:\\.|[^"\\])*)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (!match?.[1]) {
      continue;
    }

    try {
      const decoded = JSON.parse('"' + match[1] + '"') as string;
      if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
        return decodeHtmlEntities(decoded);
      }
    } catch {
      // Ignore malformed embedded JSON and continue to the next strategy.
    }
  }

  return undefined;
}

function numberOrUndefined(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function parseVideoVersions(value: unknown): ParsedVideoVersion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const results: ParsedVideoVersion[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    if (typeof record.url !== "string") {
      continue;
    }

    const url = decodeHtmlEntities(record.url);
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      continue;
    }

    results.push({
      url,
      width: numberOrUndefined(record.width),
      height: numberOrUndefined(record.height),
    });
  }

  return results;
}

function chooseBestVideoVersion(value: unknown) {
  return parseVideoVersions(value).sort((left, right) => {
    const leftPixels = (left.width ?? 0) * (left.height ?? 0);
    const rightPixels = (right.width ?? 0) * (right.height ?? 0);
    return rightPixels - leftPixels;
  })[0];
}

function findTargetInJson(
  value: unknown,
  shortcode: string,
  depth = 0,
): ParsedVideoVersion | undefined {
  if (depth > 40 || value === null || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findTargetInJson(item, shortcode, depth + 1);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const code =
    typeof record.code === "string"
      ? record.code
      : typeof record.shortcode === "string"
        ? record.shortcode
        : undefined;

  if (code === shortcode) {
    const candidate = chooseBestVideoVersion(record.video_versions);
    if (candidate) {
      return candidate;
    }
  }

  for (const nested of Object.values(record)) {
    const found = findTargetInJson(nested, shortcode, depth + 1);
    if (found) {
      return found;
    }
  }

  return undefined;
}

function extractFromJsonScripts(html: string, shortcode: string) {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = parseAttributes(match[1] ?? "");
    if (attributes.type?.toLowerCase() !== "application/json") {
      continue;
    }

    try {
      const parsed = JSON.parse(decodeHtmlEntities(match[2] ?? "")) as unknown;
      const found = findTargetInJson(parsed, shortcode);
      if (found) {
        return found;
      }
    } catch {
      // Fall through to the bounded raw Relay scanner.
    }
  }

  return undefined;
}

function extractBalancedArray(html: string, arrayStart: number) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = arrayStart; index < html.length; index++) {
    const character = html[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === "[") {
      depth++;
    } else if (character === "]") {
      depth--;
      if (depth === 0) {
        return html.slice(arrayStart, index + 1);
      }
    }
  }

  return undefined;
}

function escapeRegExp(value: string) {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}

function shortcodeAnchorIndexes(html: string, shortcode: string) {
  const escaped = escapeRegExp(shortcode);
  const expression = new RegExp(
    '"(?:code|shortcode)"\\s*:\\s*"' + escaped + '"',
    "g",
  );

  return Array.from(html.matchAll(expression))
    .map((match) => match.index)
    .filter((index): index is number => typeof index === "number");
}

function extractFromRawRelay(html: string, shortcode: string) {
  const anchors = shortcodeAnchorIndexes(html, shortcode);
  if (anchors.length === 0) {
    return undefined;
  }

  const key = '"video_versions"';
  let cursor = 0;
  let best: { distance: number; candidate: ParsedVideoVersion } | undefined;

  while (cursor < html.length) {
    const keyIndex = html.indexOf(key, cursor);
    if (keyIndex === -1) {
      break;
    }

    cursor = keyIndex + key.length;
    const colon = html.indexOf(":", cursor);
    const arrayStart = colon === -1 ? -1 : html.indexOf("[", colon + 1);

    if (arrayStart === -1 || arrayStart - keyIndex > 100) {
      continue;
    }

    const rawArray = extractBalancedArray(html, arrayStart);
    if (!rawArray) {
      continue;
    }

    try {
      const candidate = chooseBestVideoVersion(JSON.parse(rawArray) as unknown);
      if (!candidate) {
        continue;
      }

      const distance = Math.min(
        ...anchors.map((anchor) => Math.abs(anchor - keyIndex)),
      );

      if (distance > 50_000) {
        continue;
      }

      if (!best || distance < best.distance) {
        best = { distance, candidate };
      }
    } catch {
      // Ignore malformed candidate arrays and keep scanning.
    }
  }

  return best?.candidate;
}

function extractVideoVersion(html: string, shortcode?: string) {
  if (!shortcode) {
    return undefined;
  }

  return (
    extractFromJsonScripts(html, shortcode) ??
    extractFromRawRelay(html, shortcode)
  );
}

export function parseInstagramPage(
  html: string,
  shortcode?: string,
): ParsedInstagramPage {
  const videoVersion = extractVideoVersion(html, shortcode);

  if (videoVersion) {
    return {
      videoUrl: videoVersion.url,
      imageUrl: extractMetaContent(html, [
        "og:image:secure_url",
        "og:image",
        "twitter:image",
      ]),
      width: videoVersion.width,
      height: videoVersion.height,
      strategy: "video_versions",
    };
  }

  const openGraphVideo = extractMetaContent(html, [
    "og:video:secure_url",
    "og:video:url",
    "og:video",
    "twitter:player:stream",
  ]);

  const embeddedVideoUrl = openGraphVideo ? undefined : extractJsonVideoUrl(html);
  const videoUrl = openGraphVideo ?? embeddedVideoUrl;

  return {
    videoUrl,
    imageUrl: extractMetaContent(html, [
      "og:image:secure_url",
      "og:image",
      "twitter:image",
    ]),
    width: numberOrUndefined(
      extractMetaContent(html, ["og:video:width"]),
    ),
    height: numberOrUndefined(
      extractMetaContent(html, ["og:video:height"]),
    ),
    strategy: openGraphVideo
      ? "open-graph"
      : embeddedVideoUrl
        ? "embedded-video-url"
        : undefined,
  };
}
