import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Photo Downloader",
  description: "Download supported public TikTok photo posts with SaveMingo.",
  alternates: {
    canonical: "/tiktok-photo-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "TikTok Photo Downloader | SaveMingo",
    description: "Download supported public TikTok photo posts with SaveMingo.",
    url: "/tiktok-photo-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-photo" />;
}
