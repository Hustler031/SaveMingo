import { ERROR_CODES } from "@/lib/errors";
import type { MediaAsset, XContentType } from "@/lib/downloader/types";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";
import { extractXStatusId } from "@/lib/platforms/x/validation";

const SYNDICATION_URL = "https://cdn.syndication.twimg.com/tweet-result";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

type XVariant = {
  bitrate?: number;
  content_type?: string;
  url?: string;
};

type XMediaDetail = {
  type?: "photo" | "video" | "animated_gif" | string;
  media_url_https?: string;
  original_info?: {
    width?: number;
    height?: number;
  };
  sizes?: {
    large?: {
      w?: number;
      h?: number;
    };
  };
  video_info?: {
    variants?: XVariant[];
  };
};

type XPhoto = {
  url?: string;
  width?: number;
  height?: number;
};

type XVideo = {
  poster?: string;
  variants?: Array<{
    type?: string;
    src?: string;
  }>;
};

type XSyndicationResponse = {
  __typename?: string;
  id_str?: string;
  mediaDetails?: XMediaDetail[];
  photos?: XPhoto[];
  video?: XVideo;
};

function syndicationToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, "");
}

function syndicationUrl(id: string) {
  const url = new URL(SYNDICATION_URL);
  url.searchParams.set("id", id);
  url.searchParams.set("lang", "en");
  url.searchParams.set(
    "features",
    [
      "tfw_timeline_list:",
      "tfw_follower_count_sunset:true",
      "tfw_tweet_edit_backend:on",
      "tfw_refsrc_session:on",
      "tfw_fosnr_soft_interventions_enabled:on",
      "tfw_show_birdwatch_pivots_enabled:on",
      "tfw_show_business_verified_badge:on",
      "tfw_duplicate_scribes_to_settings:on",
      "tfw_use_profile_image_shape_enabled:on",
      "tfw_show_blue_verified_badge:on",
      "tfw_legacy_timeline_sunset:true",
      "tfw_show_gov_verified_badge:on",
      "tfw_show_business_affiliate_badge:on",
      "tfw_tweet_edit_frontend:on",
    ].join(";"),
  );
  url.searchParams.set("token", syndicationToken(id));
  return url;
}

function dimensionsFromUrl(raw: string | undefined) {
  if (!raw) return {};

  const match = raw.match(/\/(\d{2,5})x(\d{2,5})\//);

  if (!match) return {};

  return {
    width: Number.parseInt(match[1], 10),
    height: Number.parseInt(match[2], 10),
  };
}

function bestMp4Variant(variants: XVariant[] | undefined) {
  return (variants ?? [])
    .filter(
      (variant) =>
        variant.content_type === "video/mp4" &&
        typeof variant.url === "string" &&
        variant.url.startsWith("https://"),
    )
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
}

function bestTopLevelVideoVariant(
  variants: XVideo["variants"],
) {
  return (variants ?? [])
    .filter(
      (variant) =>
        variant.type === "video/mp4" &&
        typeof variant.src === "string" &&
        variant.src.startsWith("https://"),
    )
    .sort((a, b) => {
      const aSize = dimensionsFromUrl(a.src);
      const bSize = dimensionsFromUrl(b.src);
      return (
        (bSize.width ?? 0) * (bSize.height ?? 0) -
        (aSize.width ?? 0) * (aSize.height ?? 0)
      );
    })[0];
}

function detailDimensions(detail: XMediaDetail, sourceUrl?: string) {
  const urlDimensions = dimensionsFromUrl(sourceUrl);

  return {
    width:
      detail.original_info?.width ??
      detail.sizes?.large?.w ??
      urlDimensions.width,
    height:
      detail.original_info?.height ??
      detail.sizes?.large?.h ??
      urlDimensions.height,
  };
}

function qualityLabel(
  bitrate: number | undefined,
  width: number | undefined,
  height: number | undefined,
) {
  if (width && height) return `${width}×${height}`;
  if (bitrate) return `${Math.round(bitrate / 1000)} kbps`;
  return "Source";
}

function normalizeMedia(data: XSyndicationResponse): {
  media: MediaAsset[];
  contentType: XContentType;
} {
  const media: MediaAsset[] = [];
  let sawGif = false;

  for (const [index, detail] of (data.mediaDetails ?? []).entries()) {
    if (
      detail.type === "photo" &&
      typeof detail.media_url_https === "string" &&
      detail.media_url_https.startsWith("https://")
    ) {
      const dimensions = detailDimensions(detail);

      media.push({
        id: `x-photo-${index + 1}`,
        type: "image",
        url: detail.media_url_https,
        thumbnailUrl: detail.media_url_https,
        quality: "Source",
        width: dimensions.width,
        height: dimensions.height,
      });

      continue;
    }

    if (detail.type === "video" || detail.type === "animated_gif") {
      const variant = bestMp4Variant(detail.video_info?.variants);

      if (!variant?.url) continue;

      if (detail.type === "animated_gif") sawGif = true;

      const dimensions = detailDimensions(detail, variant.url);

      media.push({
        id: `x-video-${index + 1}`,
        type: "video",
        url: variant.url,
        thumbnailUrl: detail.media_url_https,
        quality: qualityLabel(
          variant.bitrate,
          dimensions.width,
          dimensions.height,
        ),
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  if (media.length === 0) {
    for (const [index, photo] of (data.photos ?? []).entries()) {
      if (typeof photo.url !== "string" || !photo.url.startsWith("https://")) {
        continue;
      }

      media.push({
        id: `x-photo-${index + 1}`,
        type: "image",
        url: photo.url,
        thumbnailUrl: photo.url,
        quality: "Source",
        width: photo.width,
        height: photo.height,
      });
    }
  }

  if (media.length === 0 && data.video) {
    const variant = bestTopLevelVideoVariant(data.video.variants);

    if (variant?.src) {
      const dimensions = dimensionsFromUrl(variant.src);

      media.push({
        id: "x-video-1",
        type: "video",
        url: variant.src,
        thumbnailUrl: data.video.poster,
        quality: qualityLabel(
          undefined,
          dimensions.width,
          dimensions.height,
        ),
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  if (media.length > 1) {
    return { media, contentType: "carousel" };
  }

  if (media[0]?.type === "image") {
    return { media, contentType: "photo" };
  }

  if (media[0]?.type === "video") {
    return { media, contentType: sawGif ? "gif" : "video" };
  }

  return { media, contentType: "post" };
}

export async function resolveX(sourceUrl: string) {
  const statusId = extractXStatusId(sourceUrl);

  if (!statusId) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.UNSUPPORTED_URL,
      message: "This X URL does not contain a supported post ID.",
      diagnostic: "missing-status-id",
    };
  }

  let response: Response;

  try {
    response = await fetch(syndicationUrl(statusId), {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.x.fetchTimeoutMs),
      headers: {
        Accept: "application/json,text/plain;q=0.9,*/*;q=0.1",
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
      provider: "x-syndication",
      code: timeout ? ERROR_CODES.API_TIMEOUT : ERROR_CODES.X_RESOLVER_FAILED,
      message: timeout
        ? "X took too long to respond. Try again shortly."
        : "SaveMingo could not reach X right now.",
      diagnostic: timeout ? "upstream-timeout" : "upstream-network",
      debug: {
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_NOT_FOUND,
      message: "This X post is unavailable or no longer public.",
      diagnostic: "upstream-not-found",
      debug: { upstreamStatus: response.status },
    };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_PRIVATE,
      message: "This X post is not publicly accessible.",
      diagnostic: "upstream-access-denied",
      debug: { upstreamStatus: response.status },
    };
  }

  if (response.status === 429) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.API_RATE_LIMITED,
      message: "X temporarily rate-limited this request. Try again shortly.",
      diagnostic: "upstream-rate-limited",
      debug: { upstreamStatus: response.status },
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_RESOLVER_FAILED,
      message: "X returned an unexpected response. Try again shortly.",
      diagnostic: "upstream-status",
      debug: { upstreamStatus: response.status },
    };
  }

  const declaredLength = Number.parseInt(
    response.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(declaredLength) &&
    declaredLength > RELIABILITY_POLICY.x.maxJsonBytes
  ) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_UPSTREAM_CHANGED,
      message: "X returned more data than SaveMingo expected.",
      diagnostic: "response-too-large",
      debug: { declaredLength },
    };
  }

  let raw: string;

  try {
    raw = await response.text();
  } catch (error) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_RESOLVER_FAILED,
      message: "SaveMingo could not read X’s response.",
      diagnostic: "response-read-failed",
      debug: {
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
    };
  }

  if (
    new TextEncoder().encode(raw).byteLength >
    RELIABILITY_POLICY.x.maxJsonBytes
  ) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_UPSTREAM_CHANGED,
      message: "X returned more data than SaveMingo expected.",
      diagnostic: "response-too-large",
    };
  }

  let data: XSyndicationResponse;

  try {
    data = JSON.parse(raw) as XSyndicationResponse;
  } catch {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_UPSTREAM_CHANGED,
      message: "X returned an unexpected data format.",
      diagnostic: "invalid-json",
    };
  }

  if (
    data.__typename === "TweetTombstone" ||
    Object.keys(data).length === 0
  ) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_NOT_FOUND,
      message: "This X post is unavailable or no longer public.",
      diagnostic: "tombstone-or-empty",
    };
  }

  const normalized = normalizeMedia(data);

  if (normalized.media.length === 0) {
    return {
      ok: false as const,
      provider: "x-syndication",
      code: ERROR_CODES.X_MEDIA_UNAVAILABLE,
      message: "This public X post does not expose downloadable photo or video media.",
      diagnostic: "no-downloadable-media",
    };
  }

  return {
    ok: true as const,
    provider: "x-syndication",
    strategy: "public-syndication",
    contentType: normalized.contentType,
    media: normalized.media,
  };
}
