import { ERROR_CODES } from "@/lib/errors";
import type { MediaAsset, RedditContentType } from "@/lib/downloader/types";
import { isRedditHost } from "@/lib/platforms/detect";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

const USER_AGENT =
  "SaveMingo/0.4 public-media-resolver (+https://savemingo.com)";
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

let cachedAnonymousSession:
  | {
      cookie: string;
      expiresAt: number;
    }
  | undefined;

export function __resetRedditAnonymousSessionForTests() {
  cachedAnonymousSession = undefined;
}

type RedditVideo = {
  fallback_url?: string;
  height?: number;
  width?: number;
  is_gif?: boolean;
  has_audio?: boolean;
  dash_url?: string;
  hls_url?: string;
};

type RedditPostData = {
  gallery_data?: {
    items?: Array<{ media_id?: string; id?: number }>;
  };
  media_metadata?: Record<
    string,
    {
      e?: string;
      m?: string;
      s?: {
        u?: string;
        mp4?: string;
        gif?: string;
        x?: number;
        y?: number;
      };
    }
  >;
  url_overridden_by_dest?: string;
  url?: string;
  media?: {
    reddit_video?: RedditVideo;
  };
  secure_media?: {
    reddit_video?: RedditVideo;
  };
  preview?: {
    reddit_video_preview?: RedditVideo;
    images?: Array<{
      source?: {
        url?: string;
        width?: number;
        height?: number;
      };
      variants?: {
        gif?: {
          source?: {
            url?: string;
            width?: number;
            height?: number;
          };
        };
        mp4?: {
          source?: {
            url?: string;
            width?: number;
            height?: number;
          };
        };
      };
    }>;
  };
};

function decodeReddit(value: string | undefined) {
  return value?.replace(/&amp;/g, "&");
}

function isCanonicalRedditPost(url: URL) {
  const host = url.hostname.toLowerCase();

  if (
    host !== "www.reddit.com" &&
    host !== "reddit.com" &&
    host !== "old.reddit.com" &&
    host !== "new.reddit.com"
  ) {
    return false;
  }

  return url.pathname.split("/").filter(Boolean).includes("comments");
}

function isRedditSharePath(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  const shareIndex = parts.indexOf("s");

  return shareIndex >= 0 && Boolean(parts[shareIndex + 1]);
}

function cookieValue(setCookie: string | null, name: string) {
  if (!setCookie) return undefined;

  const escaped = name.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const match = setCookie.match(
    new RegExp("(?:^|[,;]\\s*)" + escaped + "=([^;,\\s]+)", "i"),
  );

  return match?.[1];
}

function mergeCookieHeaders(...headers: Array<string | undefined>) {
  const jar = new Map<string, string>();

  for (const header of headers) {
    if (!header) continue;

    for (const part of header.split(";")) {
      const trimmed = part.trim();
      const separator = trimmed.indexOf("=");

      if (separator <= 0) continue;

      const name = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();

      if (name && value) jar.set(name, value);
    }
  }

  jar.set("over18", "1");
  jar.set("intl_splash", "false");

  return [...jar.entries()]
    .map(([name, value]) => name + "=" + value)
    .join("; ");
}

function cookiesFromResponse(response: Response) {
  const setCookie = response.headers.get("set-cookie");
  const names = [
    "loid",
    "token_v2",
    "edgebucket",
    "csrf_token",
    "session_tracker",
  ];

  const pairs = names
    .map((name) => {
      const value = cookieValue(setCookie, name);
      return value ? name + "=" + value : undefined;
    })
    .filter((value): value is string => Boolean(value));

  return mergeCookieHeaders(pairs.join("; "));
}

function redditRequestHeaders(
  cookie: string | undefined,
  accept: string,
  browserLike = false,
) {
  return {
    "User-Agent": browserLike ? BROWSER_USER_AGENT : USER_AGENT,
    Accept: accept,
    "Accept-Language": "en-US,en;q=0.9",
    ...(cookie ? { Cookie: cookie } : {}),
  };
}

async function primeRedditAnonymousSession(sourceUrl: string) {
  if (
    cachedAnonymousSession &&
    cachedAnonymousSession.expiresAt > Date.now()
  ) {
    return cachedAnonymousSession.cookie;
  }

  let cookie = mergeCookieHeaders();

  try {
    const oldReddit = await fetch("https://old.reddit.com/", {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: redditRequestHeaders(
        undefined,
        "text/html,application/xhtml+xml,*/*;q=0.8",
        true,
      ),
    });

    cookie = mergeCookieHeaders(
      cookie,
      cookiesFromResponse(oldReddit),
    );
  } catch {
    // Shreddit bootstrap below is the primary fallback.
  }

  try {
    const source = new URL(sourceUrl);
    const slug = source.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
    const bootstrap = new URL(
      "https://www.reddit.com/svc/shreddit/" + slug,
    );

    bootstrap.searchParams.set("seeker-session", "false");
    bootstrap.searchParams.set("render-mode", "partial");
    bootstrap.searchParams.set("referer", sourceUrl);

    const response = await fetch(bootstrap, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: redditRequestHeaders(
        cookie,
        "text/vnd.reddit.partial+html,text/html;q=0.9,*/*;q=0.8",
        true,
      ),
    });

    cookie = mergeCookieHeaders(
      cookie,
      cookiesFromResponse(response),
    );
  } catch {
    // A missing bootstrap cookie is handled by the actual post request.
  }

  cachedAnonymousSession = {
    cookie,
    expiresAt: Date.now() + 8 * 60 * 1000,
  };

  return cookie;
}

async function parseRedditForbidden(response: Response) {
  let body = "";

  try {
    body = await response.text();
  } catch {
    // Keep the generic result below.
  }

  try {
    const parsed = JSON.parse(body) as {
      reason?: string;
      message?: string;
      error?: number;
    };

    if (parsed.reason === "private" || parsed.reason === "quarantined") {
      return {
        code: ERROR_CODES.REDDIT_PRIVATE,
        message:
          parsed.reason === "quarantined"
            ? "This Reddit community requires account access before its media can be read."
            : "This Reddit post or community is private.",
        diagnostic: "upstream-access-restricted",
        debug: {
          upstreamStatus: response.status,
          reason: parsed.reason,
        },
      };
    }
  } catch {
    // Reddit often returns an HTML block page for generic anonymous 403s.
  }

  return {
    code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
    message:
      "Reddit blocked this anonymous media lookup. SaveMingo can retry after refreshing its public Reddit session.",
    diagnostic: "anonymous-api-blocked",
    debug: {
      upstreamStatus: response.status,
    },
  };
}

async function resolveRedditCanonical(
  sourceUrl: string,
  cookie: string,
) {
  let current = new URL(sourceUrl);

  for (
    let redirects = 0;
    redirects <= RELIABILITY_POLICY.reddit.maxRedirects;
    redirects++
  ) {
    const host = current.hostname.toLowerCase();

    if (isCanonicalRedditPost(current)) {
      return { ok: true as const, url: current };
    }

    if (!isRedditHost(current.hostname)) {
      return {
        ok: false as const,
        code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
        message: "Reddit redirected outside its supported public web hosts.",
        diagnostic: "cross-host-redirect",
      };
    }

    if (
      (host === "www.reddit.com" ||
        host === "reddit.com" ||
        host === "old.reddit.com" ||
        host === "new.reddit.com") &&
      !isRedditSharePath(current)
    ) {
      return {
        ok: false as const,
        code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
        message: "This Reddit URL is not a supported public post or share link.",
        diagnostic: "non-post-reddit-url",
      };
    }

    let response: Response;

    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(
          RELIABILITY_POLICY.reddit.fetchTimeoutMs,
        ),
        headers: redditRequestHeaders(
          cookie,
          "text/html,application/xhtml+xml,*/*;q=0.8",
          true,
        ),
      });
    } catch (error) {
      const timeout =
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError");

      return {
        ok: false as const,
        code: timeout
          ? ERROR_CODES.API_TIMEOUT
          : ERROR_CODES.REDDIT_RESOLVER_FAILED,
        message: timeout
          ? "Reddit took too long to respond. Try again shortly."
          : "SaveMingo could not reach Reddit right now.",
        diagnostic: timeout ? "upstream-timeout" : "upstream-network",
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (
        !location ||
        redirects === RELIABILITY_POLICY.reddit.maxRedirects
      ) {
        return {
          ok: false as const,
          code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
          message: "Reddit returned too many redirects.",
          diagnostic: "redirect-limit",
        };
      }

      current = new URL(location, current);
      continue;
    }

    if (response.status === 401 || response.status === 403) {
      const blocked = await parseRedditForbidden(response);

      return {
        ok: false as const,
        ...blocked,
      };
    }

    return {
      ok: false as const,
      code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: "This Reddit link could not be normalized to a public post.",
      diagnostic: "canonicalization-failed",
      debug: { upstreamStatus: response.status },
    };
  }

  return {
    ok: false as const,
    code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
    message: "This Reddit link could not be normalized.",
    diagnostic: "unexpected-loop-exit",
  };
}

function redditJsonUrl(source: URL) {
  const clean = new URL(source.toString());
  clean.protocol = "https:";
  clean.hostname = "www.reddit.com";
  clean.search = "";
  clean.hash = "";

  let pathname = clean.pathname.replace(/\/+$/, "");
  if (!pathname.endsWith(".json")) pathname += ".json";

  clean.pathname = pathname;
  clean.searchParams.set("raw_json", "1");

  return clean;
}

function firstPostData(payload: unknown): RedditPostData | undefined {
  if (!Array.isArray(payload)) return undefined;

  const listing = payload[0] as
    | {
        data?: {
          children?: Array<{
            data?: RedditPostData;
          }>;
        };
      }
    | undefined;

  return listing?.data?.children?.[0]?.data;
}

function normalizeGallery(post: RedditPostData) {
  const media: MediaAsset[] = [];

  for (const item of post.gallery_data?.items ?? []) {
    if (!item.media_id) continue;

    const detail = post.media_metadata?.[item.media_id];
    const sourceUrl =
      decodeReddit(detail?.s?.mp4) ??
      decodeReddit(detail?.s?.gif) ??
      decodeReddit(detail?.s?.u);

    if (!sourceUrl?.startsWith("https://")) continue;

    const isVideo =
      Boolean(detail?.s?.mp4) ||
      detail?.e === "AnimatedImage" ||
      detail?.m === "image/gif";

    media.push({
      id: "reddit-gallery-" + String(media.length + 1),
      type: isVideo ? "video" : "image",
      url: sourceUrl,
      thumbnailUrl: isVideo ? decodeReddit(detail?.s?.u) : sourceUrl,
      quality: "Source",
      width: detail?.s?.x,
      height: detail?.s?.y,
    });
  }

  return media;
}

function normalizeVideo(
  post: RedditPostData,
): { asset: MediaAsset; contentType: RedditContentType } | undefined {
  const video =
    post.secure_media?.reddit_video ??
    post.media?.reddit_video ??
    post.preview?.reddit_video_preview;

  const url = decodeReddit(video?.fallback_url);
  const dashUrl = decodeReddit(video?.dash_url);

  if (!url?.startsWith("https://")) return undefined;

  return {
    asset: {
      id: "reddit-video-1",
      type: "video" as const,
      url,
      quality:
        video?.width && video?.height
          ? String(video.width) + "×" + String(video.height)
          : "Best available",
      width: video?.width,
      height: video?.height,
      audioStatus: video?.is_gif
        ? "none"
        : video?.has_audio === true
          ? "separate"
          : video?.has_audio === false
            ? "none"
            : "unknown",
      merge:
        !video?.is_gif &&
        video?.has_audio === true &&
        dashUrl?.startsWith("https://")
          ? {
              strategy: "dash-audio",
              manifestUrl: dashUrl,
            }
          : undefined,
    },
    contentType: video?.is_gif
      ? ("gif" as RedditContentType)
      : ("video" as RedditContentType),
  };
}

function normalizeGif(post: RedditPostData): MediaAsset | undefined {
  const variant =
    post.preview?.images?.[0]?.variants?.mp4?.source ??
    post.preview?.images?.[0]?.variants?.gif?.source;

  const url = decodeReddit(variant?.url);

  if (!url?.startsWith("https://")) return undefined;

  return {
    id: "reddit-gif-1",
    type: "video" as const,
    url,
    quality: "Source",
    width: variant?.width,
    height: variant?.height,
  };
}

function normalizeSingleImage(post: RedditPostData): MediaAsset | undefined {
  const direct = decodeReddit(post.url_overridden_by_dest ?? post.url);

  if (direct?.startsWith("https://")) {
    try {
      const host = new URL(direct).hostname.toLowerCase();
      if (host.endsWith("redd.it") || host.endsWith("redditmedia.com")) {
        return {
          id: "reddit-image-1",
          type: "image" as const,
          url: direct,
          thumbnailUrl: direct,
          quality: "Source",
        };
      }
    } catch {
      // Fall through to Reddit preview metadata.
    }
  }

  const source = post.preview?.images?.[0]?.source;
  const previewUrl = decodeReddit(source?.url);

  if (!previewUrl?.startsWith("https://")) return undefined;

  return {
    id: "reddit-image-1",
    type: "image" as const,
    url: previewUrl,
    thumbnailUrl: previewUrl,
    quality: "Source",
    width: source?.width,
    height: source?.height,
  };
}

export async function resolveReddit(sourceUrl: string) {
  let cookie = await primeRedditAnonymousSession(sourceUrl);
  const canonical = await resolveRedditCanonical(sourceUrl, cookie);

  if (!canonical.ok) {
    return {
      provider: "reddit-public-json",
      ...canonical,
    };
  }

  let response: Response;

  try {
    const jsonUrl = redditJsonUrl(canonical.url);

    response = await fetch(jsonUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: redditRequestHeaders(
        cookie,
        "application/json,text/plain;q=0.9,*/*;q=0.1",
      ),
    });

    if (response.status === 403) {
      cachedAnonymousSession = undefined;
      cookie = await primeRedditAnonymousSession(canonical.url.toString());

      response = await fetch(jsonUrl, {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
        headers: redditRequestHeaders(
          cookie,
          "application/json,text/plain;q=0.9,*/*;q=0.1",
        ),
      });
    }
  } catch (error) {
    const timeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: timeout
        ? ERROR_CODES.API_TIMEOUT
        : ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: timeout
        ? "Reddit took too long to respond. Try again shortly."
        : "SaveMingo could not reach Reddit right now.",
      diagnostic: timeout ? "upstream-timeout" : "upstream-network",
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_NOT_FOUND,
      message: "This Reddit post is unavailable or no longer public.",
      diagnostic: "upstream-not-found",
    };
  }

  if (response.status === 401 || response.status === 403) {
    const blocked = await parseRedditForbidden(response);

    return {
      ok: false as const,
      provider: "reddit-public-json",
      ...blocked,
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: "Reddit returned an unexpected response.",
      diagnostic: "upstream-status",
      debug: { upstreamStatus: response.status },
    };
  }

  const raw = await response.text();

  if (
    new TextEncoder().encode(raw).byteLength >
    RELIABILITY_POLICY.reddit.maxJsonBytes
  ) {
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_UPSTREAM_CHANGED,
      message: "Reddit returned more data than SaveMingo expected.",
      diagnostic: "response-too-large",
    };
  }

  let payload: unknown;

  try {
    payload = JSON.parse(raw);
  } catch {
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_UPSTREAM_CHANGED,
      message: "Reddit returned an unexpected data format.",
      diagnostic: "invalid-json",
    };
  }

  const post = firstPostData(payload);

  if (!post) {
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_NOT_FOUND,
      message: "This Reddit post is unavailable or no longer public.",
      diagnostic: "missing-post-data",
    };
  }

  const gallery = normalizeGallery(post);
  if (gallery.length > 0) {
    return {
      ok: true as const,
      provider: "reddit-public-json",
      strategy: "public-post-json",
      contentType: "gallery" as RedditContentType,
      media: gallery,
    };
  }

  const video = normalizeVideo(post);
  if (video) {
    return {
      ok: true as const,
      provider: "reddit-public-json",
      strategy: "public-post-json",
      contentType: video.contentType,
      media: [video.asset],
    };
  }

  const gif = normalizeGif(post);
  if (gif) {
    return {
      ok: true as const,
      provider: "reddit-public-json",
      strategy: "public-post-json",
      contentType: "gif" as RedditContentType,
      media: [gif],
    };
  }

  const image = normalizeSingleImage(post);
  if (image) {
    return {
      ok: true as const,
      provider: "reddit-public-json",
      strategy: "public-post-json",
      contentType: "photo" as RedditContentType,
      media: [image],
    };
  }

  return {
    ok: false as const,
    provider: "reddit-public-json",
    code: ERROR_CODES.REDDIT_MEDIA_UNAVAILABLE,
    message:
      "This public Reddit post does not expose downloadable Reddit-hosted media.",
    diagnostic: "no-downloadable-media",
  };
}
