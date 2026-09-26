import { ERROR_CODES } from "@/lib/errors";
import type { MediaAsset, PinterestContentType } from "@/lib/downloader/types";
import { extractPinterestPinId } from "@/lib/platforms/pinterest/validation";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

type PinterestImage = { url?: string; width?: number; height?: number };
type PinterestResponse = {
  id?: string;
  video_url?: string | null;
  media?: {
    media_type?: string;
    images?: Record<string, PinterestImage>;
    video_url?: string | null;
    videos?: Record<string, { url?: string; width?: number; height?: number }>;
  };
};

function bestImage(images: Record<string, PinterestImage> | undefined) {
  return Object.values(images ?? {})
    .filter((item) => typeof item.url === "string")
    .sort((a,b) => (b.width ?? 0)*(b.height ?? 0) - (a.width ?? 0)*(a.height ?? 0))[0];
}

function bestVideo(data: PinterestResponse) {
  const candidates: Array<{url:string;width?:number;height?:number}> = [];
  if (typeof data.video_url === "string") candidates.push({url:data.video_url});
  if (typeof data.media?.video_url === "string") candidates.push({url:data.media.video_url});
  for (const item of Object.values(data.media?.videos ?? {})) {
    if (typeof item.url === "string") candidates.push(item as {url:string;width?:number;height?:number});
  }
  return candidates
    .filter((item) => item.url.startsWith("https://"))
    .sort((a,b) => (b.width ?? 0)*(b.height ?? 0) - (a.width ?? 0)*(a.height ?? 0))[0];
}

export async function resolvePinterest(sourceUrl: string) {
  const token = process.env.PINTEREST_ACCESS_TOKEN;

  if (!token) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_ACCESS_REQUIRED,
      message: "Pinterest API access is not connected to this SaveMingo environment yet.",
      diagnostic: "missing-access-token",
    };
  }

  const pinId = extractPinterestPinId(sourceUrl);
  if (!pinId) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.UNSUPPORTED_URL,
      message: "This Pinterest URL does not contain a supported Pin ID.",
      diagnostic: "missing-pin-id",
    };
  }

  let response: Response;
  try {
    response = await fetch(`https://api.pinterest.com/v5/pins/${pinId}?pin_metrics=false`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(RELIABILITY_POLICY.pinterest.fetchTimeoutMs),
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
      message: "SaveMingo could not reach Pinterest right now.",
      diagnostic: "network",
      debug: { errorName: error instanceof Error ? error.name : "UnknownError" },
    };
  }

  const raw = await response.text();
  let data: PinterestResponse & { message?: string; detail?: string };

  try {
    data = JSON.parse(raw);
  } catch {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_UPSTREAM_CHANGED,
      message: "Pinterest returned an unexpected response format.",
      diagnostic: "invalid-json",
    };
  }

  if (response.status === 401 || response.status === 403) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_ACCESS_REQUIRED,
      message: "Pinterest API access for this Pin is not approved in the current environment.",
      diagnostic: data.detail || data.message || "access-denied",
      debug: { upstreamStatus: response.status },
    };
  }

  if (response.status === 404) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_NOT_FOUND,
      message: "This Pinterest Pin is unavailable or not accessible.",
      diagnostic: "not-found",
    };
  }

  if (!response.ok) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_RESOLVER_FAILED,
      message: "Pinterest returned an unexpected response.",
      diagnostic: data.message || "upstream-status",
      debug: { upstreamStatus: response.status },
    };
  }

  const media: MediaAsset[] = [];
  let contentType: PinterestContentType = "pin";
  const video = bestVideo(data);

  if (video?.url) {
    media.push({
      id: "pinterest-video-1",
      type: "video",
      url: video.url,
      quality: video.width && video.height ? `${video.width}×${video.height}` : "Best available",
      width: video.width,
      height: video.height,
    });
    contentType = "video";
  } else {
    const image = bestImage(data.media?.images);
    if (image?.url) {
      media.push({
        id: "pinterest-image-1",
        type: "image",
        url: image.url,
        thumbnailUrl: image.url,
        quality: "Best available",
        width: image.width,
        height: image.height,
      });
      contentType = image.url.toLowerCase().includes(".gif") ? "gif" : "photo";
    }
  }

  if (!media.length) {
    return {
      ok: false as const,
      provider: "pinterest-api",
      code: ERROR_CODES.PINTEREST_MEDIA_UNAVAILABLE,
      message: "Pinterest did not expose downloadable media for this Pin through the approved API.",
      diagnostic: "no-media",
    };
  }

  return {
    ok: true as const,
    provider: "pinterest-api",
    strategy: "official-api",
    contentType,
    media,
  };
}
