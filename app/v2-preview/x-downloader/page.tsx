import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "X / Twitter Downloader — SaveMingo V2 Preview",
  description: "Download public X and Twitter videos, GIFs and images with SaveMingo. Paste a post link, no login required.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-all" />;
}
