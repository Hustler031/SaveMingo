import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit GIF Downloader",
  description: "Download supported Reddit GIF and animated media posts with SaveMingo.",
  alternates: {
    canonical: "/reddit-gif-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Reddit GIF Downloader | SaveMingo",
    description: "Download supported Reddit GIF and animated media posts with SaveMingo.",
    url: "/reddit-gif-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-gif" />;
}
