import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter Image Downloader",
  description: "Download supported public images and multi-photo posts from Twitter and X with SaveMingo.",
  alternates: {
    canonical: "/twitter-image-downloader",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Twitter Image Downloader | SaveMingo",
    description: "Download supported public images and multi-photo posts from Twitter and X with SaveMingo.",
    url: "/twitter-image-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-image" />;
}
