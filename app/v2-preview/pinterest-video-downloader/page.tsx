import type { Metadata } from "next";
import { V2PinterestToolPage } from "@/components/v2/V2PinterestToolPage";

export const metadata: Metadata = {
  title: "Pinterest Video Downloader | SaveMingo",
  description: "Download supported public Pinterest video Pins when the connected Pinterest API exposes video media.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PinterestToolPage kind="video" />;
}
