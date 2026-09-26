import { ERROR_CODES } from "@/lib/errors";
import type { MediaAsset, PinterestContentType } from "@/lib/downloader/types";
import { isPinterestHost } from "@/lib/platforms/detect";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

function decodeHtml(value: string) {
  return value
    .replace(/\\u002F/gi, "/")
    .replace(/\\u0026/gi, "&")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function metaContent(html: string, property: string) {
  const escaped = property.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const patterns = [
    new RegExp(
      '<meta[^>]+(?:property|name)=["\\']' +
        escaped +
        '["\\'][^>]+content=["\\']([^"\\']+)["\\'][^>]*>',
      "i",
    ),
    new RegExp(
      '<meta[^>]+content=["\\']([^"\\']+)["\\'][^>]+(?:property|name)=["\\']' +
        escaped +
        '["\\'][^>]*>',
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return undefined;
}

function pinimgUrls(html: string, kind: "video" | "image") {
  const regex =
    kind === "video"
      ? /https?(?:\\u002F|\\\/|\/){2}[a-z0-9.-]*pinimg\.com(?:\\u002F|\\\/|\/)[^"'<>\\\s]+?\.mp4(?:\?[^"'<>\\\s]*)?/gi
      : /https?(?:\\u002F|\\\/|\/){2}[a-z0-9.-]*pinimg\.com(?:\\u002F|\\\/|\/)[^"'<>\\\s]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"'<>\\\s]*)?/gi;

  const unique = new Set<string>();

  for (const match of html.matchAll(regex)) {
    const value = decodeHtml(match[0]);

    try {
      const url = new URL(value);
      if (url.protocol === "https:" && url.hostname.endsWith("pinimg.com")) {
        unique.add(url.toString());
      }
    } catch {
      // Ignore malformed embedded URLs.
    }
  }

  return [...unique];
}

function dimensionsFromUrl(raw: string | undefined) {
  const match = raw?.match(/(\d{3,4})x(\d{3,4})/i);
  if (!match) return {};

  return {
    width: Number.parseInt(match[1], 10),
    height: Number.parseInt(match[2], 10),
  };
}

function videoScore(url: string) {
  const dimensions = dimensionsFromUrl(url);
  return (dimensions.width ?? 0) * (dimensions.height ?? 0);
}

async function fetchPinterestPage(sourceUrl: string) {
  let current = new URL(sourceUrl);

  for (
    let redirects = 0;
    redirects <= RELIABILITY_POLICY.pinterest.maxRedirects;
    redirects++
  ) {
    if (!isPinterestHost(current.hostname)) {
      return {
        ok: false as const,
        code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
        message: "Pinterest redirected outside its supported public web hosts.",
        diagnostic: "cross-host-redirect",
      };
    }

    let response: Response;

    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(
          RELIABILITY_POLICY.pinterest.fetchTimeoutMs,
        ),
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.8",
          "User-Agent": USER_AGENT,
        },
      });
    } catch (error) {
      const timeout =
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      return {
        ok: false as const,
        code: timeout
          ? ERROR_CODES.API_TIMEOUT
          : ERROR_CODES.PINTEREST_RESOLVER_FAILED,
        message: timeout
          ? "Pinterest took too long to respond. Try again shortly."
          : "SaveMingo could not reach Pinterest right now.",
        diagnostic: timeout ? "upstream-timeout" : "upstream-network",
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (
        !location ||
        redirects === RELIABILITY_POLICY.pinterest.maxRedirects
      ) {
        return {
          ok: false as const,
          code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
          message: "Pinterest returned too many redirects.",
          diagnostic: "redirect-limit",
        };
      }

      const next = new URL(location, current);

      if (!isPinterestHost(next.hostname)) {
        return {
          ok: false as const,
          code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
          message: "Pinterest redirected outside its supported public web hosts.",
          diagnostic: "cross-host-redirect",
        };
      }

      current = next;
      continue;
    }

    if (response.status === 404) {
      return {
        ok: false as const,
        code: ERROR_CODES.PINTEREST_NOT_FOUND,
        message: "This Pinterest pin is unavailable or no longer public.",
        diagnostic: "upstream-not-found",
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false as const,
        code: ERROR_CODES.PINTEREST_PRIVATE,
        message: "This Pinterest pin is not publicly accessible.",
        diagnostic: "upstream-access-denied",
      };
    }

    if (!response.ok) {
      return {
        ok: false as const,
        code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
        message: "Pinterest returned an unexpected response.",
        diagnostic: "upstream-status",
        debug: { upstreamStatus: response.status },
      };
    }

    const html = await response.text();

    if (
      new TextEncoder().encode(html).byteLength >
      RELIABILITY_POLICY.pinterest.maxHtmlBytes
    ) {
      return {
        ok: false as const,
        code: ERROR_CODES.PINTEREST_UPSTREAM_CHANGED,
        message: "Pinterest returned more page data than SaveMingo expected.",
        diagnostic: "response-too-large",
      };
    }

    return {
      ok: true as const,
      html,
    };
  }

  return {
    ok: false as const,
    code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
    message: "Pinterest could not be resolved.",
    diagnostic: "unexpected-loop-exit",
  };
}

export async function resolvePinterest(sourceUrl: string) {
  const page = await fetchPinterestPage(sourceUrl);

  if (!page.ok) {
    return {
      ok: false as const,
      provider: "pinterest-public-page",
      ...page,
    };
  }

  const html = page.html;
  const ogVideo =
    metaContent(html, "og:video:secure_url") ??
    metaContent(html, "og:video") ??
    metaContent(html, "twitter:player:stream");

  const videos = [
    ...(ogVideo?.includes("pinimg.com") ? [ogVideo] : []),
    ...pinimgUrls(html, "video"),
  ];

  const bestVideo = [...new Set(videos)].sort(
    (a, b) => videoScore(b) - videoScore(a),
  )[0];

  if (bestVideo) {
    const dimensions = dimensionsFromUrl(bestVideo);
    const thumbnail =
      metaContent(html, "og:image") ??
      metaContent(html, "twitter:image");

    const media: MediaAsset[] = [
      {
        id: "pinterest-video-1",
        type: "video",
        url: bestVideo,
        thumbnailUrl:
          thumbnail?.includes("pinimg.com") ? thumbnail : undefined,
        quality:
          dimensions.width && dimensions.height
            ? String(dimensions.width) + "×" + String(dimensions.height)
            : "Best available",
        width: dimensions.width,
        height: dimensions.height,
      },
    ];

    return {
      ok: true as const,
      provider: "pinterest-public-page",
      strategy: "public-page-metadata",
      contentType: "video" as PinterestContentType,
      media,
    };
  }

  const ogImage =
    metaContent(html, "og:image") ??
    metaContent(html, "twitter:image") ??
    metaContent(html, "twitter:image:src");

  if (ogImage?.includes("pinimg.com")) {
    return {
      ok: true as const,
      provider: "pinterest-public-page",
      strategy: "public-page-metadata",
      contentType: "photo" as PinterestContentType,
      media: [
        {
          id: "pinterest-image-1",
          type: "image" as const,
          url: ogImage,
          thumbnailUrl: ogImage,
          quality: "Source",
        },
      ],
    };
  }

  return {
    ok: false as const,
    provider: "pinterest-public-page",
    code: ERROR_CODES.PINTEREST_MEDIA_UNAVAILABLE,
    message:
      "This public Pinterest pin does not expose downloadable video or image media.",
    diagnostic: "no-downloadable-media",
  };
}
