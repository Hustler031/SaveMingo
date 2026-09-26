import { ERROR_CODES } from "@/lib/errors";
import type {
  MediaAsset,
  TikTokContentType,
} from "@/lib/downloader/types";
import { isTikTokHost } from "@/lib/platforms/detect";
import { RELIABILITY_POLICY } from "@/lib/reliability/policy";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36";

type TikTokUrlList = {
  urlList?: string[];
  UrlList?: string[];
};

type TikTokVideo = {
  width?: number;
  height?: number;
  cover?: string;
  dynamicCover?: string;
  playAddr?: string;
  downloadAddr?: string;
  playAddrStruct?: TikTokUrlList;
  downloadAddrStruct?: TikTokUrlList;
  bitrateInfo?: Array<{
    Bitrate?: number;
    bitrate?: number;
    PlayAddr?: TikTokUrlList;
    playAddr?: TikTokUrlList;
  }>;
};

type TikTokImage = {
  imageURL?: TikTokUrlList;
  displayImage?: TikTokUrlList;
};

type TikTokItem = {
  id?: string;
  video?: TikTokVideo;
  imagePost?: {
    images?: TikTokImage[];
  };
};

function firstUrl(value: TikTokUrlList | undefined) {
  return value?.urlList?.[0] ?? value?.UrlList?.[0];
}

function validHttps(raw: string | undefined) {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function extractScriptJson(html: string, id: string) {
  const markers = ['id="' + id + '"', "id='" + id + "'"];
  let markerIndex = -1;

  for (const marker of markers) {
    markerIndex = html.indexOf(marker);
    if (markerIndex >= 0) break;
  }

  if (markerIndex < 0) return undefined;

  const scriptStart = html.lastIndexOf("<script", markerIndex);
  const contentStart = html.indexOf(">", markerIndex);
  const contentEnd = html.indexOf("</script>", contentStart + 1);

  if (
    scriptStart < 0 ||
    contentStart < 0 ||
    contentEnd < 0 ||
    contentEnd <= contentStart
  ) {
    return undefined;
  }

  try {
    return JSON.parse(
      html.slice(contentStart + 1, contentEnd),
    ) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function universalItem(html: string): TikTokItem | undefined {
  const data = extractScriptJson(html, "__UNIVERSAL_DATA_FOR_REHYDRATION__");
  const scope = data?.__DEFAULT_SCOPE__ as Record<string, unknown> | undefined;
  const detail = scope?.["webapp.video-detail"] as
    | {
        itemInfo?: {
          itemStruct?: TikTokItem;
        };
      }
    | undefined;

  return detail?.itemInfo?.itemStruct;
}

function sigiItem(html: string): TikTokItem | undefined {
  const data = extractScriptJson(html, "SIGI_STATE") as
    | {
        ItemModule?: Record<string, TikTokItem>;
      }
    | undefined;

  return data?.ItemModule
    ? Object.values(data.ItemModule)[0]
    : undefined;
}

function chooseVideo(video: TikTokVideo | undefined) {
  if (!video) return undefined;

  const bitrateCandidates = (video.bitrateInfo ?? [])
    .map((entry) => ({
      bitrate: entry.Bitrate ?? entry.bitrate ?? 0,
      url: validHttps(firstUrl(entry.PlayAddr ?? entry.playAddr)),
    }))
    .filter(
      (entry): entry is { bitrate: number; url: string } =>
        typeof entry.url === "string",
    )
    .sort((a, b) => b.bitrate - a.bitrate);

  const bitrateBest = bitrateCandidates[0];

  if (bitrateBest) {
    return {
      url: bitrateBest.url,
      quality:
        bitrateBest.bitrate > 0
          ? Math.round(bitrateBest.bitrate / 1000) + " kbps"
          : "Best available",
    };
  }

  const playUrl =
    validHttps(firstUrl(video.playAddrStruct)) ??
    validHttps(video.playAddr);

  if (playUrl) {
    return {
      url: playUrl,
      quality: "Best available",
    };
  }

  const downloadUrl =
    validHttps(firstUrl(video.downloadAddrStruct)) ??
    validHttps(video.downloadAddr);

  if (downloadUrl) {
    return {
      url: downloadUrl,
      quality: "Available source",
    };
  }

  return undefined;
}

function normalizeTikTokItem(item: TikTokItem) {
  const images = item.imagePost?.images ?? [];

  if (images.length > 0) {
    const media: MediaAsset[] = images
      .map((image, index) => {
        const url = validHttps(
          firstUrl(image.imageURL) ?? firstUrl(image.displayImage),
        );

        if (!url) return null;

        return {
          id: "tiktok-photo-" + String(index + 1),
          type: "image" as const,
          url,
          thumbnailUrl: url,
          quality: "Source",
        };
      })
      .filter((item): item is MediaAsset => item !== null);

    if (media.length > 0) {
      return {
        contentType:
          media.length > 1
            ? ("slideshow" as TikTokContentType)
            : ("photo" as TikTokContentType),
        media,
      };
    }
  }

  const selected = chooseVideo(item.video);

  if (selected) {
    const cover =
      validHttps(item.video?.cover) ??
      validHttps(item.video?.dynamicCover);

    const media: MediaAsset[] = [
      {
        id: "tiktok-video-1",
        type: "video",
        url: selected.url,
        thumbnailUrl: cover,
        quality: selected.quality,
        width: item.video?.width,
        height: item.video?.height,
      },
    ];

    return {
      contentType: "video" as TikTokContentType,
      media,
    };
  }

  return {
    contentType: "post" as TikTokContentType,
    media: [] as MediaAsset[],
  };
}

async function fetchTikTokPage(sourceUrl: string) {
  let current = new URL(sourceUrl);

  for (
    let redirects = 0;
    redirects <= RELIABILITY_POLICY.tiktok.maxRedirects;
    redirects++
  ) {
    if (!isTikTokHost(current.hostname)) {
      return {
        ok: false as const,
        code: ERROR_CODES.TIKTOK_RESOLVER_FAILED,
        message: "TikTok redirected outside its supported public web hosts.",
        diagnostic: "cross-host-redirect",
      };
    }

    let response: Response;

    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(RELIABILITY_POLICY.tiktok.fetchTimeoutMs),
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": USER_AGENT,
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
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
          : ERROR_CODES.TIKTOK_RESOLVER_FAILED,
        message: timeout
          ? "TikTok took too long to respond. Try again shortly."
          : "SaveMingo could not reach TikTok right now.",
        diagnostic: timeout ? "upstream-timeout" : "upstream-network",
      };
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (
        !location ||
        redirects === RELIABILITY_POLICY.tiktok.maxRedirects
      ) {
        return {
          ok: false as const,
          code: ERROR_CODES.TIKTOK_RESOLVER_FAILED,
          message: "TikTok returned too many redirects.",
          diagnostic: "redirect-limit",
        };
      }

      const next = new URL(location, current);

      if (!isTikTokHost(next.hostname)) {
        return {
          ok: false as const,
          code: ERROR_CODES.TIKTOK_RESOLVER_FAILED,
          message: "TikTok redirected outside its supported public web hosts.",
          diagnostic: "cross-host-redirect",
        };
      }

      current = next;
      continue;
    }

    if (response.status === 404) {
      return {
        ok: false as const,
        code: ERROR_CODES.TIKTOK_NOT_FOUND,
        message: "This TikTok post is unavailable or no longer public.",
        diagnostic: "upstream-not-found",
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false as const,
        code: ERROR_CODES.TIKTOK_PRIVATE,
        message:
          "TikTok did not expose this post publicly to SaveMingo. Private or challenged posts are not supported.",
        diagnostic: "upstream-access-denied",
      };
    }

    if (response.status === 429) {
      return {
        ok: false as const,
        code: ERROR_CODES.API_RATE_LIMITED,
        message: "TikTok temporarily rate-limited this request. Try again shortly.",
        diagnostic: "upstream-rate-limited",
      };
    }

    if (!response.ok) {
      return {
        ok: false as const,
        code: ERROR_CODES.TIKTOK_RESOLVER_FAILED,
        message: "TikTok returned an unexpected response.",
        diagnostic: "upstream-status",
        debug: { upstreamStatus: response.status },
      };
    }

    const raw = await response.text();

    if (
      new TextEncoder().encode(raw).byteLength >
      RELIABILITY_POLICY.tiktok.maxHtmlBytes
    ) {
      return {
        ok: false as const,
        code: ERROR_CODES.TIKTOK_UPSTREAM_CHANGED,
        message: "TikTok returned more page data than SaveMingo expected.",
        diagnostic: "response-too-large",
      };
    }

    return {
      ok: true as const,
      html: raw,
      canonicalUrl: current.toString(),
    };
  }

  return {
    ok: false as const,
    code: ERROR_CODES.TIKTOK_RESOLVER_FAILED,
    message: "TikTok could not be resolved.",
    diagnostic: "unexpected-loop-exit",
  };
}

export async function resolveTikTok(sourceUrl: string) {
  const page = await fetchTikTokPage(sourceUrl);

  if (!page.ok) {
    return {
      provider: "tiktok-public-page",
      ...page,
    };
  }

  const item =
    universalItem(page.html) ??
    sigiItem(page.html);

  if (!item) {
    return {
      ok: false as const,
      provider: "tiktok-public-page",
      code: ERROR_CODES.TIKTOK_UPSTREAM_CHANGED,
      message:
        "TikTok did not expose the public post data SaveMingo expected. Try again later.",
      diagnostic: "hydration-data-missing",
    };
  }

  const normalized = normalizeTikTokItem(item);

  if (normalized.media.length === 0) {
    return {
      ok: false as const,
      provider: "tiktok-public-page",
      code: ERROR_CODES.TIKTOK_MEDIA_UNAVAILABLE,
      message:
        "This public TikTok post does not expose downloadable video or photo media.",
      diagnostic: "no-downloadable-media",
    };
  }

  return {
    ok: true as const,
    provider: "tiktok-public-page",
    strategy: "hydration-json",
    contentType: normalized.contentType,
    media: normalized.media,
  };
}
