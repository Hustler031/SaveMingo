import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Video Downloader — SaveMingo V2 Preview",
  description: "Download the available Reddit-hosted video track from supported public Reddit posts.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-video" />;
}
