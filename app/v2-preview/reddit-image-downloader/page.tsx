import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Image Downloader — SaveMingo V2 Preview",
  description: "Download supported Reddit-hosted images and gallery media from public Reddit post links.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-image" />;
}
