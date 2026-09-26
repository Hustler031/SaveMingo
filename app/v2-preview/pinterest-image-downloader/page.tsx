import type { Metadata } from "next";
import { V2PinterestToolPage } from "@/components/v2/V2PinterestToolPage";

export const metadata: Metadata = {
  title: "Pinterest Image Downloader | SaveMingo",
  description: "Download the best image rendition exposed for a supported public Pinterest Pin.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PinterestToolPage kind="image" />;
}
