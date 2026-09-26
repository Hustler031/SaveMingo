import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter Image Downloader — SaveMingo V2 Preview",
  description: "Download public Twitter and X photos and multi-image post media with SaveMingo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-image" />;
}
