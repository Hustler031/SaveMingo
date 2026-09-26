import type { Metadata } from "next";
import { V2InstagramToolPage } from "@/components/v2/V2InstagramToolPage";
import { instagramSeoPages } from "@/lib/seo/instagram-pages";

const page = instagramSeoPages.reels;

export const metadata: Metadata = {
  title: "Instagram Reels Downloader",
  description: page.description,
  alternates: { canonical: page.slug },
  openGraph: {
    title: "Instagram Reels Downloader | SaveMingo",
    description: page.description,
    url: page.slug,
  },
};

export default function InstagramReelsDownloaderPage() {
  return <V2InstagramToolPage kind="reels" />;
}
