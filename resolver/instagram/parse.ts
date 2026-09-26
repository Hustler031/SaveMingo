export type ParsedInstagramPage = {
  videoUrl?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
};

type Attributes = Record<string, string>;

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

function parsePositiveInteger(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseInstagramPage(html: string): ParsedInstagramPage {
  const videoUrl =
    extractMetaContent(html, [
      "og:video:secure_url",
      "og:video:url",
      "og:video",
      "twitter:player:stream",
    ]) ?? extractJsonVideoUrl(html);

  const imageUrl = extractMetaContent(html, [
    "og:image:secure_url",
    "og:image",
    "twitter:image",
  ]);

  const width = parsePositiveInteger(
    extractMetaContent(html, ["og:video:width"]),
  );
  const height = parsePositiveInteger(
    extractMetaContent(html, ["og:video:height"]),
  );

  return {
    videoUrl,
    imageUrl,
    width,
    height,
  };
}
