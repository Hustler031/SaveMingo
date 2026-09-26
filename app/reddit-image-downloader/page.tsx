import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Image Downloader",
  description: "Download supported public Reddit images and galleries with SaveMingo.",
  alternates: {
    canonical: "/reddit-image-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reddit Image Downloader | SaveMingo",
    description: "Download supported public Reddit images and galleries with SaveMingo.",
    url: "/reddit-image-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-image" />;
}
