import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest Video Downloader",
  description: "Download supported public Pinterest video pins with SaveMingo.",
  alternates: {
    canonical: "/pinterest-video-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Pinterest Video Downloader | SaveMingo",
    description: "Download supported public Pinterest video pins with SaveMingo.",
    url: "/pinterest-video-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-video" />;
}
