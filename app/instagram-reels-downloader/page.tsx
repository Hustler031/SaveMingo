import type { Metadata } from "next";
import { InstagramLandingPage } from "@/components/seo/InstagramLandingPage";
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
  return <InstagramLandingPage page={page} />;
}
