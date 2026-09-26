import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "X / Twitter Downloader",
  description: "Download public X and Twitter videos, GIFs, and images with SaveMingo. Paste a supported post link, no login required.",
  alternates: {
    canonical: "/x-downloader",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "X / Twitter Downloader | SaveMingo",
    description: "Download public X and Twitter videos, GIFs, and images with SaveMingo. Paste a supported post link, no login required.",
    url: "/x-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-all" />;
}
