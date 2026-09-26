import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Downloader",
  description: "Download supported Reddit-hosted videos, images, GIFs, and galleries from public Reddit posts.",
  alternates: {
    canonical: "/reddit-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reddit Downloader | SaveMingo",
    description: "Download supported Reddit-hosted videos, images, GIFs, and galleries from public Reddit posts.",
    url: "/reddit-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-all" />;
}
