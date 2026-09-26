import { ERROR_CODES } from "@/lib/errors";
import type { MediaAsset, RedditContentType } from "@/lib/downloader/types";
import { isRedditHost } from "@/lib/platforms/detect";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

const USER_AGENT =
  "SaveMingo/0.4 public-media-resolver (+https://savemingo.com)";

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

async function resolveRedditCanonical(sourceUrl: string) {
  let current = new URL(sourceUrl);

  for (
    let redirects = 0;
    redirects <= RELIABILITY_POLICY.reddit.maxRedirects;
    redirects++
  ) {
    const host = current.hostname.toLowerCase();

    if (
      host === "www.reddit.com" ||
      host === "reddit.com" ||
      host === "old.reddit.com" ||
      host === "new.reddit.com"
    ) {
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

    let response: Response;

    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(
          RELIABILITY_POLICY.reddit.fetchTimeoutMs,
        ),
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,*/*;q=0.8",
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
  const canonical = await resolveRedditCanonical(sourceUrl);

  if (!canonical.ok) {
    return {
      provider: "reddit-public-json",
      ...canonical,
    };
  }

  let response: Response;

  try {
    response = await fetch(redditJsonUrl(canonical.url), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });
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
    return {
      ok: false as const,
      provider: "reddit-public-json",
      code: ERROR_CODES.REDDIT_PRIVATE,
      message: "This Reddit post is not publicly accessible.",
      diagnostic: "upstream-access-denied",
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
