import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Slideshow Downloader",
  description: "Download supported public TikTok photo slideshows and save available images together.",
  alternates: {
    canonical: "/tiktok-slideshow-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "TikTok Slideshow Downloader | SaveMingo",
    description: "Download supported public TikTok photo slideshows and save available images together.",
    url: "/tiktok-slideshow-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-slideshow" />;
}
