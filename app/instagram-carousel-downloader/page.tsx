import type { Metadata } from "next";
import { V2InstagramToolPage } from "@/components/v2/V2InstagramToolPage";
import { instagramSeoPages } from "@/lib/seo/instagram-pages";

const page = instagramSeoPages.carousel;

export const metadata: Metadata = {
  title: "Instagram Carousel Downloader",
  description: page.description,
  alternates: { canonical: page.slug },
  openGraph: {
    title: "Instagram Carousel Downloader | SaveMingo",
    description: page.description,
    url: page.slug,
  },
};

export default function InstagramCarouselDownloaderPage() {
  return <V2InstagramToolPage kind="carousel" />;
}
