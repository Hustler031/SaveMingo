import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Downloader — SaveMingo V2 Preview",
  description: "Download supported public TikTok videos and photo slideshows from full or short TikTok links with SaveMingo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-all" />;
}
