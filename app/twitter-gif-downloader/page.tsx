import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter GIF Downloader",
  description: "Download supported GIF-style posts from Twitter and X. SaveMingo uses the real looping video source X exposes.",
  alternates: {
    canonical: "/twitter-gif-downloader",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Twitter GIF Downloader | SaveMingo",
    description: "Download supported GIF-style posts from Twitter and X. SaveMingo uses the real looping video source X exposes.",
    url: "/twitter-gif-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-gif" />;
}
