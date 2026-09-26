import type { Metadata } from "next";
import { V2PinterestToolPage } from "@/components/v2/V2PinterestToolPage";

export const metadata: Metadata = {
  title: "Pinterest Downloader — Video, Image & GIF | SaveMingo",
  description: "Pinterest downloader preview for public Pins using approved Pinterest API access.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PinterestToolPage kind="all" />;
}
