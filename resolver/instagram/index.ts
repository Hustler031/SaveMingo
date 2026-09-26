import type { InstagramContentType } from "@/lib/downloader/types";
import { resolveInstagramPublicPage } from "@/resolver/instagram/public-page-provider";

export async function resolveInstagram(
  sourceUrl: string,
  contentType: InstagramContentType,
) {
  return resolveInstagramPublicPage(sourceUrl, contentType);
}
