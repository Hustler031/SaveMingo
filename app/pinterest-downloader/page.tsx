import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest Downloader",
  description: "Download supported public Pinterest videos and images from pinterest.com and pin.it links with SaveMingo.",
  alternates: {
    canonical: "/pinterest-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Pinterest Downloader | SaveMingo",
    description: "Download supported public Pinterest videos and images from pinterest.com and pin.it links with SaveMingo.",
    url: "/pinterest-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-all" />;
}
