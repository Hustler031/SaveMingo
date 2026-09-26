import { ERROR_CODES } from "@/lib/errors";
import type {
  MediaAsset,
  RedditContentType,
} from "@/lib/downloader/types";
import { isAllowedRedditMediaUrl } from "@/lib/media-url";
import { extractRedditPostId } from "@/lib/platforms/reddit/validation";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

type RedditVideo = {
  fallback_url?: string;
  dash_url?: string;
  hls_url?: string;
  is_gif?: boolean;
  width?: number;
  height?: number;
};

type RedditGalleryItem = {
  media_id?: string;
};

type RedditMediaMetadata = {
  status?: string;
  e?: string;
  m?: string;
  s?: {
    u?: string;
    gif?: string;
    mp4?: string;
    x?: number;
    y?: number;
  };
};

type RedditPostData = {
  id?: string;
  name?: string;
  title?: string;
  post_hint?: string;
  is_gallery?: boolean;
  is_video?: boolean;
  url?: string;
  url_overridden_by_dest?: string;
  secure_media?: {
    reddit_video?: RedditVideo;
  } | null;
  media?: {
    reddit_video?: RedditVideo;
  } | null;
  gallery_data?: {
    items?: RedditGalleryItem[];
  };
  media_metadata?: Record<string, RedditMediaMetadata>;
  preview?: {
    reddit_video_preview?: RedditVideo;
    images?: Array<{
      source?: {
        url?: string;
        width?: number;
        height?: number;
      };
    }>;
  };
};

type RedditListing = {
  data?: {
    children?: Array<{
      kind?: string;
      data?: RedditPostData;
    }>;
  };
};

type RedditTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
};

let tokenCache:
  | {
      value: string;
      expiresAt: number;
    }
  | undefined;

function config() {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  const userAgent = process.env.REDDIT_USER_AGENT?.trim();

  if (!clientId || !clientSecret || !userAgent) return null;

  return { clientId, clientSecret, userAgent };
}

function decodeUrl(raw: string | undefined) {
  if (!raw) return undefined;
  return raw.replaceAll("&amp;", "&");
}

async function getAccessToken() {
  const reddit = config();

  if (!reddit) {
    return {
      ok: false as const,
      code: ERROR_CODES.REDDIT_ACCESS_REQUIRED,
      message:
        "Reddit API access is not connected to this SaveMingo environment yet.",
      diagnostic: "missing-api-config",
    };
  }

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return {
      ok: true as const,
      token: tokenCache.value,
      userAgent: reddit.userAgent,
    };
  }

  let response: Response;

  try {
    response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${btoa(
          reddit.clientId + ":" + reddit.clientSecret,
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": reddit.userAgent,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "read",
      }),
    });
  } catch (error) {
    return {
      ok: false as const,
      code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: "SaveMingo could not reach Reddit’s authorization service.",
      diagnostic: "oauth-network",
      debug: {
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
    };
  }

  let payload: RedditTokenResponse;

  try {
    payload = (await response.json()) as RedditTokenResponse;
  } catch {
    return {
      ok: false as const,
      code: ERROR_CODES.REDDIT_UPSTREAM_CHANGED,
      message: "Reddit returned an unexpected authorization response.",
      diagnostic: "oauth-invalid-json",
    };
  }

  if (!response.ok || !payload.access_token) {
    return {
      ok: false as const,
      code: ERROR_CODES.REDDIT_ACCESS_REQUIRED,
      message:
        "Reddit API authorization is not approved or configured for this SaveMingo environment.",
      diagnostic: payload.error || "oauth-denied",
      debug: { upstreamStatus: response.status },
    };
  }

  tokenCache = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(60, payload.expires_in ?? 3600) * 1000,
  };

  return {
    ok: true as const,
    token: payload.access_token,
    userAgent: reddit.userAgent,
  };
}

function redditVideo(post: RedditPostData) {
  return (
    post.secure_media?.reddit_video ??
    post.media?.reddit_video ??
    post.preview?.reddit_video_preview
  );
}

function normalizeGallery(post: RedditPostData) {
  const media: MediaAsset[] = [];

  for (const [index, item] of (post.gallery_data?.items ?? []).entries()) {
    const metadata = item.media_id
      ? post.media_metadata?.[item.media_id]
      : undefined;

    if (!metadata || metadata.status === "failed") continue;

    const mp4 = decodeUrl(metadata.s?.mp4);
    const gif = decodeUrl(metadata.s?.gif);
    const image = decodeUrl(metadata.s?.u);

    if (mp4 && isAllowedRedditMediaUrl(mp4)) {
      media.push({
        id: `reddit-gallery-video-${index + 1}`,
        type: "video",
        url: mp4,
        thumbnailUrl:
          image && isAllowedRedditMediaUrl(image) ? image : undefined,
        quality:
          metadata.s?.x && metadata.s?.y
            ? `${metadata.s.x}×${metadata.s.y}`
            : "Source",
        width: metadata.s?.x,
        height: metadata.s?.y,
      });
      continue;
    }

    const source = gif ?? image;
    if (source && isAllowedRedditMediaUrl(source)) {
      media.push({
        id: `reddit-gallery-image-${index + 1}`,
        type: "image",
        url: source,
        thumbnailUrl: source,
        quality: "Source",
        width: metadata.s?.x,
        height: metadata.s?.y,
      });
    }
  }

  return media;
}

function normalizeMedia(post: RedditPostData): {
  media: MediaAsset[];
  contentType: RedditContentType;
} {
  if (post.is_gallery || post.gallery_data?.items?.length) {
    const media = normalizeGallery(post);
    if (media.length) {
      return {
        media,
        contentType: "gallery",
      };
    }
  }

  const video = redditVideo(post);
  const fallback = decodeUrl(video?.fallback_url);

  if (fallback && isAllowedRedditMediaUrl(fallback)) {
    return {
      media: [
        {
          id: "reddit-video-1",
          type: "video",
          url: fallback,
          quality:
            video?.width && video?.height
              ? `${video.width}×${video.height}`
              : "Best available",
          width: video?.width,
          height: video?.height,
        },
      ],
      contentType: video?.is_gif ? "gif" : "video",
    };
  }

  const direct = decodeUrl(post.url_overridden_by_dest ?? post.url);

  if (direct && isAllowedRedditMediaUrl(direct)) {
    return {
      media: [
        {
          id: "reddit-image-1",
          type: "image",
          url: direct,
          thumbnailUrl: direct,
          quality: "Source",
        },
      ],
      contentType: "image",
    };
  }

  const preview = post.preview?.images?.[0]?.source;
  const previewUrl = decodeUrl(preview?.url);

  if (previewUrl && isAllowedRedditMediaUrl(previewUrl)) {
    return {
      media: [
        {
          id: "reddit-image-1",
          type: "image",
          url: previewUrl,
          thumbnailUrl: previewUrl,
          quality:
            preview?.width && preview?.height
              ? `${preview.width}×${preview.height}`
              : "Best available",
          width: preview?.width,
          height: preview?.height,
        },
      ],
      contentType: "image",
    };
  }

  return {
    media: [],
    contentType: "post",
  };
}

export async function resolveReddit(sourceUrl: string) {
  const postId = extractRedditPostId(sourceUrl);

  if (!postId) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.UNSUPPORTED_URL,
      message: "This Reddit URL does not contain a supported post ID.",
      diagnostic: "missing-post-id",
    };
  }

  const auth = await getAccessToken();

  if (!auth.ok) {
    return {
      ok: false as const,
      provider: "reddit-api",
      ...auth,
    };
  }

  let response: Response;

  try {
    const url = new URL("https://oauth.reddit.com/api/info");
    url.searchParams.set("id", `t3_${postId}`);
    url.searchParams.set("raw_json", "1");

    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.reddit.fetchTimeoutMs),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
        "User-Agent": auth.userAgent,
      },
    });
  } catch (error) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: "SaveMingo could not reach Reddit right now.",
      diagnostic: "api-network",
      debug: {
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
    };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_ACCESS_REQUIRED,
      message:
        "Reddit API access is not approved for this SaveMingo environment.",
      diagnostic: "api-access-denied",
      debug: { upstreamStatus: response.status },
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_NOT_FOUND,
      message: "This Reddit post is unavailable.",
      diagnostic: "not-found",
    };
  }

  const raw = await response.text();

  if (
    new TextEncoder().encode(raw).byteLength >
    RELIABILITY_POLICY.reddit.maxJsonBytes
  ) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_UPSTREAM_CHANGED,
      message: "Reddit returned more data than SaveMingo expected.",
      diagnostic: "response-too-large",
    };
  }

  let listing: RedditListing;

  try {
    listing = JSON.parse(raw) as RedditListing;
  } catch {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_UPSTREAM_CHANGED,
      message: "Reddit returned an unexpected response format.",
      diagnostic: "invalid-json",
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_RESOLVER_FAILED,
      message: "Reddit returned an unexpected response.",
      diagnostic: "upstream-status",
      debug: { upstreamStatus: response.status },
    };
  }

  const post = listing.data?.children?.find(
    (child) => child.kind === "t3",
  )?.data;

  if (!post) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_NOT_FOUND,
      message: "This Reddit post is unavailable or not accessible.",
      diagnostic: "missing-post",
    };
  }

  const normalized = normalizeMedia(post);

  if (!normalized.media.length) {
    return {
      ok: false as const,
      provider: "reddit-api",
      code: ERROR_CODES.REDDIT_MEDIA_UNAVAILABLE,
      message:
        "This Reddit post does not expose supported Reddit-hosted downloadable media through the approved API.",
      diagnostic: "no-supported-media",
    };
  }

  return {
    ok: true as const,
    provider: "reddit-api",
    strategy: "official-oauth-api",
    contentType: normalized.contentType,
    media: normalized.media,
  };
}
