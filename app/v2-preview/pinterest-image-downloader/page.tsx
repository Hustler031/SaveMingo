import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest Image Downloader — SaveMingo V2 Preview",
  description: "Download supported public Pinterest image pins directly from a pin link.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-image" />;
}
