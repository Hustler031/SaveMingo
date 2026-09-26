import type { Metadata } from "next";
import { V2InstagramToolPage } from "@/components/v2/V2InstagramToolPage";

export const metadata: Metadata = {
  title: "Instagram Downloader",
  description:
    "Download supported public Instagram Reels, videos, photos, and carousel posts with SaveMingo. Paste one public link, no login required.",
  alternates: {
    canonical: "/instagram-downloader",
  },
  openGraph: {
    title: "Instagram Downloader | SaveMingo",
    description:
      "Download supported public Instagram Reels, videos, photos, and carousels with one clean downloader.",
    url: "/instagram-downloader",
  },
};

export default function InstagramDownloaderPage() {
  return <V2InstagramToolPage kind="all" />;
}
