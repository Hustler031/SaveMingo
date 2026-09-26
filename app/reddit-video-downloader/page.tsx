import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Video Downloader with Sound",
  description: "Download supported public Reddit videos. When Reddit exposes separate audio, SaveMingo merges video and audio, with a video-only fallback.",
  alternates: {
    canonical: "/reddit-video-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reddit Video Downloader with Sound | SaveMingo",
    description: "Download supported public Reddit videos. When Reddit exposes separate audio, SaveMingo merges video and audio, with a video-only fallback.",
    url: "/reddit-video-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-video" />;
}
