import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Downloader — SaveMingo V2 Preview",
  description: "Download supported Reddit-hosted videos, images, GIFs and galleries from public Reddit post links.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-all" />;
}
