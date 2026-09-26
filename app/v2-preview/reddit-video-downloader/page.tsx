import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit Video Downloader with Sound Check — SaveMingo V2 Preview",
  description: "Reddit video downloader with sound check. Paste a public Reddit post, see whether audio is detected, then download the available video track.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-video" />;
}
