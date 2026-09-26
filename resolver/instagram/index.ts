import type { InstagramContentType } from "@/lib/downloader/types";
import { resolveInstagramGraphql } from "@/resolver/instagram/graphql-provider";
import { resolveInstagramPublicPage } from "@/resolver/instagram/public-page-provider";

function extractShortcode(sourceUrl: string) {
  try {
    const parts = new URL(sourceUrl).pathname
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

    if (["reel", "reels", "p", "tv"].includes(parts[0] ?? "")) {
      return parts[1];
    }

    if (parts[0] === "share" && ["reel", "p"].includes(parts[1] ?? "")) {
      return parts[2];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export async function resolveInstagram(
  sourceUrl: string,
  contentType: InstagramContentType,
) {
  const publicPage = await resolveInstagramPublicPage(sourceUrl, contentType);

  if (publicPage.ok) {
    return publicPage;
  }

  const shortcode = extractShortcode(sourceUrl);

  if (!shortcode) {
    return publicPage;
  }

  return resolveInstagramGraphql(sourceUrl, shortcode, contentType);
}
