import type { Metadata } from "next";
import { InstagramLandingPage } from "@/components/seo/InstagramLandingPage";
import { instagramSeoPages } from "@/lib/seo/instagram-pages";

const page = instagramSeoPages.photo;

export const metadata: Metadata = {
  title: "Instagram Photo Downloader",
  description: page.description,
  alternates: { canonical: page.slug },
  openGraph: {
    title: "Instagram Photo Downloader | SaveMingo",
    description: page.description,
    url: page.slug,
  },
};

export default function InstagramPhotoDownloaderPage() {
  return <InstagramLandingPage page={page} />;
}
