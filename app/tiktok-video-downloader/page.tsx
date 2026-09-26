import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Video Downloader",
  description: "Download supported public TikTok videos. SaveMingo uses a clean source when TikTok publicly exposes one.",
  alternates: {
    canonical: "/tiktok-video-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "TikTok Video Downloader | SaveMingo",
    description: "Download supported public TikTok videos. SaveMingo uses a clean source when TikTok publicly exposes one.",
    url: "/tiktok-video-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-video" />;
}
