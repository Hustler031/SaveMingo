import { ERROR_CODES, type SaveMingoErrorCode } from "@/lib/errors";\nimport { RELIABILITY_POLICY } from "@/lib/reliability/policy";
import type {
  InstagramContentType,
  MediaAsset,
} from "@/lib/downloader/types";

const DEFAULT_DOC_ID = "27128499623469141";
const RELIABILITY_POLICY.instagram.fetchTimeoutMs = 10_000;
const WEB_APP_ID = "936619743392459";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

type GraphqlDebug = {
  httpStatus?: number;
  hasData?: boolean;
  hasItems?: boolean;
  errorCount?: number;
  docId: string;
};

type GraphqlSuccess = {
  ok: true;
  provider: "graphql";
  contentType: InstagramContentType;
  media: MediaAsset[];
  strategy:
    | "graphql-video-versions"
    | "graphql-image-versions"
    | "graphql-carousel";
};

type GraphqlFailure = {
  ok: false;
  provider: "graphql";
  code: SaveMingoErrorCode;
  message: string;
  diagnostic:
    | "bootstrap-failed"
    | "rate-limited"
    | "bad-request"
    | "execution-error"
    | "not-found"
    | "timeout"
    | "network"
    | "no-media";
  debug: GraphqlDebug;
};

export type InstagramGraphqlResult = GraphqlSuccess | GraphqlFailure;

type InstagramMediaItem = {
  id?: unknown;
  pk?: unknown;
  code?: unknown;
  media_type?: unknown;
  video_versions?: unknown;
  image_versions2?: unknown;
  carousel_media?: unknown;
};

function failure(
  code: SaveMingoErrorCode,
  message: string,
  diagnostic: GraphqlFailure["diagnostic"],
  debug: GraphqlDebug,
): GraphqlFailure {
  return {
    ok: false,
    provider: "graphql",
    code,
    message,
    diagnostic,
    debug,
  };
}

function getDocId() {
  return process.env.INSTAGRAM_GRAPHQL_DOC_ID?.trim() || DEFAULT_DOC_ID;
}

function getSetCookies(headers: Headers) {
  const enhanced = headers as Headers & {
    getSetCookie?: () => string[];
  };

  const values = enhanced.getSetCookie?.();
  if (values?.length) {
    return values;
  }

  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

function cookieHeaderFromSetCookies(setCookies: string[]) {
  return setCookies
    .map((cookie) => cookie.split(";", 1)[0]?.trim())
    .filter((cookie): cookie is string => Boolean(cookie))
    .join("; ");
}

function readCookie(cookieHeader: string, name: string) {
  for (const part of cookieHeader.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) {
      return valueParts.join("=");
    }
  }

  return "";
}

function asPositiveNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  return undefined;
}

function selectBestVideoVersion(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const candidates = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return undefined;
      }

      const record = item as Record<string, unknown>;
      if (typeof record.url !== "string" || !record.url.startsWith("http")) {
        return undefined;
      }

      return {
        url: record.url,
        width: asPositiveNumber(record.width),
        height: asPositiveNumber(record.height),
      };
    })
    .filter(
      (
        item,
      ): item is {
        url: string;
        width: number | undefined;
        height: number | undefined;
      } => Boolean(item),
    );

  return candidates.sort((left, right) => {
    const leftPixels = (left.width ?? 0) * (left.height ?? 0);
    const rightPixels = (right.width ?? 0) * (right.height ?? 0);
    return rightPixels - leftPixels;
  })[0];
}

function selectBestImage(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidates = (value as Record<string, unknown>).candidates;
  if (!Array.isArray(candidates)) {
    return undefined;
  }

  return candidates
    .map((item) => {
      if (!item || typeof item !== "object") {
        return undefined;
      }

      const record = item as Record<string, unknown>;
      if (typeof record.url !== "string" || !record.url.startsWith("http")) {
        return undefined;
      }

      return {
        url: record.url,
        width: asPositiveNumber(record.width),
        height: asPositiveNumber(record.height),
      };
    })
    .filter(
      (
        item,
      ): item is {
        url: string;
        width: number | undefined;
        height: number | undefined;
      } => Boolean(item),
    )
    .sort((left, right) => {
      const leftPixels = (left.width ?? 0) * (left.height ?? 0);
      const rightPixels = (right.width ?? 0) * (right.height ?? 0);
      return rightPixels - leftPixels;
    })[0];
}

function mediaId(item: InstagramMediaItem, index: number) {
  for (const value of [item.id, item.pk, item.code]) {
    if (typeof value === "string" && value) {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "media-" + String(index + 1);
}

function normalizeAsset(
  item: InstagramMediaItem,
  index: number,
): MediaAsset | undefined {
  const video = selectBestVideoVersion(item.video_versions);
  const image = selectBestImage(item.image_versions2);

  if (video) {
    return {
      id: mediaId(item, index),
      type: "video",
      url: video.url,
      thumbnailUrl: image?.url,
      width: video.width,
      height: video.height,
      quality: "Source",
    };
  }

  if (image) {
    return {
      id: mediaId(item, index),
      type: "image",
      url: image.url,
      width: image.width,
      height: image.height,
      quality: "Image",
    };
  }

  return undefined;
}

export function normalizeGraphqlMediaItem(
  item: InstagramMediaItem,
  requestedType: InstagramContentType,
): GraphqlSuccess | undefined {
  if (Array.isArray(item.carousel_media) && item.carousel_media.length > 0) {
    const media: MediaAsset[] = [];

    for (let index = 0; index < item.carousel_media.length; index++) {
      const child = item.carousel_media[index];

      if (!child || typeof child !== "object") {
        return undefined;
      }

      const asset = normalizeAsset(child as InstagramMediaItem, index);
      if (!asset) {
        return undefined;
      }

      media.push(asset);
    }

    return {
      ok: true,
      provider: "graphql",
      contentType: "carousel",
      strategy: "graphql-carousel",
      media,
    };
  }

  const asset = normalizeAsset(item, 0);
  if (!asset) {
    return undefined;
  }

  if (asset.type === "video") {
    return {
      ok: true,
      provider: "graphql",
      contentType: requestedType === "reel" ? "reel" : "video",
      strategy: "graphql-video-versions",
      media: [asset],
    };
  }

  return {
    ok: true,
    provider: "graphql",
    contentType: "photo",
    strategy: "graphql-image-versions",
    media: [asset],
  };
}

// Retained during SM-004 so any downstream code from SM-003 keeps compiling.
export const normalizeGraphqlVideoItem = normalizeGraphqlMediaItem;

async function bootstrapAnonymousSession() {
  const response = await fetch("https://www.instagram.com/", {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(RELIABILITY_POLICY.instagram.fetchTimeoutMs),
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    return {
      ok: false as const,
      status: response.status,
      cookieHeader: "",
      csrf: "",
    };
  }

  const cookieHeader = cookieHeaderFromSetCookies(
    getSetCookies(response.headers),
  );

  return {
    ok: true as const,
    status: response.status,
    cookieHeader,
    csrf: readCookie(cookieHeader, "csrftoken"),
  };
}

export async function resolveInstagramGraphql(
  sourceUrl: string,
  shortcode: string,
  requestedType: InstagramContentType,
): Promise<InstagramGraphqlResult> {
  const docId = getDocId();
  const baseDebug: GraphqlDebug = {
    docId,
  };

  let session: Awaited<ReturnType<typeof bootstrapAnonymousSession>>;

  try {
    session = await bootstrapAnonymousSession();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return failure(
        ERROR_CODES.API_TIMEOUT,
        "Instagram took too long to start a public session.",
        "timeout",
        baseDebug,
      );
    }

    return failure(
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "SaveMingo couldn’t start an anonymous Instagram session.",
      "network",
      baseDebug,
    );
  }

  if (!session.ok) {
    return failure(
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "Instagram refused the anonymous resolver session.",
      "bootstrap-failed",
      {
        ...baseDebug,
        httpStatus: session.status,
      },
    );
  }

  const body = new URLSearchParams({
    variables: JSON.stringify({
      shortcode,
      __relay_internal__pv__PolarisAIGMMediaWebLabelEnabledrelayprovider:
        false,
    }),
    doc_id: docId,
    server_timestamps: "true",
  });

  let response: Response;

  try {
    response = await fetch("https://www.instagram.com/graphql/query", {
      method: "POST",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.instagram.fetchTimeoutMs),
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: sourceUrl,
        "User-Agent": USER_AGENT,
        "x-csrftoken": session.csrf,
        "x-ig-app-id": WEB_APP_ID,
        ...(session.cookieHeader
          ? {
              Cookie: session.cookieHeader,
            }
          : {}),
      },
      body,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return failure(
        ERROR_CODES.API_TIMEOUT,
        "Instagram’s media query took too long to respond.",
        "timeout",
        baseDebug,
      );
    }

    return failure(
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "SaveMingo couldn’t reach Instagram’s media query.",
      "network",
      baseDebug,
    );
  }

  const debug: GraphqlDebug = {
    ...baseDebug,
    httpStatus: response.status,
  };

  if (response.status === 429) {
    return failure(
      ERROR_CODES.API_RATE_LIMITED,
      "Instagram is temporarily limiting media requests. Try again shortly.",
      "rate-limited",
      debug,
    );
  }

  if (response.status === 400 || response.status === 403) {
    return failure(
      ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
      "Instagram rejected the current media query.",
      "bad-request",
      debug,
    );
  }

  if (!response.ok) {
    return failure(
      ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
      "Instagram returned an unexpected media-query response.",
      "network",
      debug,
    );
  }

  let payload: unknown;

  try {
    payload = (await response.json()) as unknown;
  } catch {
    return failure(
      ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
      "Instagram returned an unreadable media-query response.",
      "execution-error",
      debug,
    );
  }

  if (!payload || typeof payload !== "object") {
    return failure(
      ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
      "Instagram returned an empty media-query response.",
      "execution-error",
      debug,
    );
  }

  const root = payload as Record<string, unknown>;
  const errors = Array.isArray(root.errors) ? root.errors : [];
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : undefined;

  debug.hasData = Boolean(data);
  debug.errorCount = errors.length;

  const webInfo =
    data?.xdt_api__v1__media__shortcode__web_info &&
    typeof data.xdt_api__v1__media__shortcode__web_info === "object"
      ? (data.xdt_api__v1__media__shortcode__web_info as Record<
          string,
          unknown
        >)
      : undefined;

  const items = Array.isArray(webInfo?.items) ? webInfo.items : [];
  debug.hasItems = items.length > 0;

  if (items.length === 0) {
    if (errors.length > 0 || !data) {
      return failure(
        ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
        "Instagram’s current media query could not resolve this public post.",
        "execution-error",
        debug,
      );
    }

    return failure(
      ERROR_CODES.INSTAGRAM_NOT_FOUND,
      "Instagram did not return media for this shortcode.",
      "not-found",
      debug,
    );
  }

  const first = items[0];
  if (!first || typeof first !== "object") {
    return failure(
      ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
      "Instagram returned an unexpected media record.",
      "execution-error",
      debug,
    );
  }

  const normalized = normalizeGraphqlMediaItem(
    first as InstagramMediaItem,
    requestedType,
  );

  if (normalized) {
    return normalized;
  }

  return failure(
    ERROR_CODES.INSTAGRAM_MEDIA_UNAVAILABLE,
    "Instagram returned the post but SaveMingo could not normalize its public media.",
    "no-media",
    debug,
  );
}
