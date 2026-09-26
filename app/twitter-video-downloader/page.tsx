import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter Video Downloader",
  description: "Download supported public Twitter and X videos as the available MP4 source. Works with x.com and legacy twitter.com post links.",
  alternates: {
    canonical: "/twitter-video-downloader",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Twitter Video Downloader | SaveMingo",
    description: "Download supported public Twitter and X videos as the available MP4 source. Works with x.com and legacy twitter.com post links.",
    url: "/twitter-video-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-video" />;
}
