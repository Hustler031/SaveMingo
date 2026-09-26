import { ERROR_CODES, type SaveMingoErrorCode } from "@/lib/errors";
import type {
  InstagramContentType,
  MediaAsset,
} from "@/lib/downloader/types";
import { isInstagramHost } from "@/lib/downloader/validation";
import { parseInstagramPage } from "@/resolver/instagram/parse";

const MAX_REDIRECTS = 3;
const MAX_HTML_BYTES = 5_000_000;
const FETCH_TIMEOUT_MS = 10_000;

type ProviderSuccess = {
  ok: true;
  provider: "public-page";
  contentType: InstagramContentType;
  media: MediaAsset[];
};

type ProviderFailure = {
  ok: false;
  provider: "public-page";
  code: SaveMingoErrorCode;
  message: string;
  diagnostic:
    | "not-found"
    | "rate-limited"
    | "access-denied"
    | "timeout"
    | "non-html"
    | "too-large"
    | "redirect-blocked"
    | "no-video"
    | "upstream-changed"
    | "network";
};

export type InstagramProviderResult = ProviderSuccess | ProviderFailure;

function failure(
  code: SaveMingoErrorCode,
  message: string,
  diagnostic: ProviderFailure["diagnostic"],
): ProviderFailure {
  return {
    ok: false,
    provider: "public-page",
    code,
    message,
    diagnostic,
  };
}

async function fetchInstagramHtml(sourceUrl: string) {
  let currentUrl = new URL(sourceUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    if (!isInstagramHost(currentUrl.hostname)) {
      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "Instagram redirected this link somewhere SaveMingo won’t follow.",
        "redirect-blocked",
      );
    }

    let response: Response;

    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError")
      ) {
        return failure(
          ERROR_CODES.API_TIMEOUT,
          "Instagram took too long to respond. Try the link again.",
          "timeout",
        );
      }

      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "SaveMingo couldn’t reach Instagram for this link.",
        "network",
      );
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");

      if (!location || redirectCount === MAX_REDIRECTS) {
        return failure(
          ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
          "Instagram returned an unexpected redirect.",
          "redirect-blocked",
        );
      }

      currentUrl = new URL(location, currentUrl);
      continue;
    }

    if (response.status === 404) {
      return failure(
        ERROR_CODES.INSTAGRAM_NOT_FOUND,
        "This Instagram link could not be found.",
        "not-found",
      );
    }

    if (response.status === 429) {
      return failure(
        ERROR_CODES.API_RATE_LIMITED,
        "Instagram is temporarily limiting requests. Try again shortly.",
        "rate-limited",
      );
    }

    if (response.status === 401 || response.status === 403) {
      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "Instagram refused the public request for this link.",
        "access-denied",
      );
    }

    if (!response.ok) {
      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "Instagram returned an unexpected response.",
        "network",
      );
    }

    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.includes("text/html")) {
      return failure(
        ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
        "Instagram returned an unexpected page format.",
        "non-html",
      );
    }

    const contentLength = Number.parseInt(
      response.headers.get("content-length") ?? "0",
      10,
    );

    if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) {
      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "Instagram returned a page that was too large to inspect safely.",
        "too-large",
      );
    }

    const html = await response.text();

    if (html.length > MAX_HTML_BYTES) {
      return failure(
        ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
        "Instagram returned a page that was too large to inspect safely.",
        "too-large",
      );
    }

    return {
      ok: true as const,
      html,
    };
  }

  return failure(
    ERROR_CODES.INSTAGRAM_RESOLVER_FAILED,
    "Instagram returned too many redirects.",
    "redirect-blocked",
  );
}

export async function resolveInstagramPublicPage(
  sourceUrl: string,
  requestedType: InstagramContentType,
): Promise<InstagramProviderResult> {
  const fetched = await fetchInstagramHtml(sourceUrl);

  if (!fetched.ok) {
    return fetched;
  }

  const parsed = parseInstagramPage(fetched.html);

  if (parsed.videoUrl) {
    const media: MediaAsset = {
      id: "media-1",
      type: "video",
      url: parsed.videoUrl,
      thumbnailUrl: parsed.imageUrl,
      width: parsed.width,
      height: parsed.height,
      quality: "Source",
    };

    return {
      ok: true,
      provider: "public-page",
      contentType: requestedType === "reel" ? "reel" : "video",
      media: [media],
    };
  }

  if (requestedType === "post" && parsed.imageUrl) {
    return failure(
      ERROR_CODES.INSTAGRAM_MEDIA_UNAVAILABLE,
      "This post does not expose a single public video. Photo and carousel resolution comes next.",
      "no-video",
    );
  }

  const looksPrivate =
    /this account is private|is_private["']?\s*[:=]\s*true/i.test(
      fetched.html,
    );

  if (looksPrivate) {
    return failure(
      ERROR_CODES.INSTAGRAM_PRIVATE,
      "This Instagram content is not publicly accessible.",
      "access-denied",
    );
  }

  return failure(
    ERROR_CODES.INSTAGRAM_UPSTREAM_CHANGED,
    "SaveMingo found the page but Instagram did not expose a usable public video.",
    "upstream-changed",
  );
}
