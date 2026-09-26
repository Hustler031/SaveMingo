import type { Metadata } from "next";
import { V2PinterestToolPage } from "@/components/v2/V2PinterestToolPage";

export const metadata: Metadata = {
  title: "Pinterest GIF Downloader | SaveMingo",
  description: "Download supported Pinterest animated Pin media through the approved API connection.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PinterestToolPage kind="gif" />;
}
