import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Downloader",
  description: "Download supported public TikTok videos, photos, and slideshows from full or short TikTok links with SaveMingo.",
  alternates: {
    canonical: "/tiktok-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "TikTok Downloader | SaveMingo",
    description: "Download supported public TikTok videos, photos, and slideshows from full or short TikTok links with SaveMingo.",
    url: "/tiktok-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-all" />;
}
