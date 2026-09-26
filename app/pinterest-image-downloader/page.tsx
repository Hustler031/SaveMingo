import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest Image Downloader",
  description: "Download supported public Pinterest images with SaveMingo.",
  alternates: {
    canonical: "/pinterest-image-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Pinterest Image Downloader | SaveMingo",
    description: "Download supported public Pinterest images with SaveMingo.",
    url: "/pinterest-image-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-image" />;
}
