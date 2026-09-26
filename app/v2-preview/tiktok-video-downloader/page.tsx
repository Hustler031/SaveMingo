import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "TikTok Video Downloader — SaveMingo V2 Preview",
  description: "Download supported public TikTok videos. Clean no-watermark playback source is used when TikTok exposes one.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="tiktok-video" />;
}
