import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Photo Downloader — SaveMingo V2 Preview",
  description: "Download supported public TikTok photo-post images individually or together with SaveMingo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-photo" />;
}
