import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest Downloader — SaveMingo V2 Preview",
  description: "Download supported public Pinterest videos and images from pinterest.com and pin.it links with SaveMingo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-all" />;
}
