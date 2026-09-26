import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter Video Downloader — SaveMingo V2 Preview",
  description: "Download public Twitter and X videos as MP4 with SaveMingo. Supports x.com and twitter.com post links.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-video" />;
}
