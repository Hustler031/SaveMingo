import type { Metadata } from "next";
import { InstagramLandingPage } from "@/components/seo/InstagramLandingPage";
import { instagramSeoPages } from "@/lib/seo/instagram-pages";

const page = instagramSeoPages.video;

export const metadata: Metadata = {
  title: "Instagram Video Downloader",
  description: page.description,
  alternates: { canonical: page.slug },
  openGraph: {
    title: "Instagram Video Downloader | SaveMingo",
    description: page.description,
    url: page.slug,
  },
};

export default function InstagramVideoDownloaderPage() {
  return <InstagramLandingPage page={page} />;
}
