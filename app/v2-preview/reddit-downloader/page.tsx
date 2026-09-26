import type { Metadata } from "next";
import { V2RedditToolPage } from "@/components/v2/V2RedditToolPage";

export const metadata: Metadata = {
  title: "Reddit Downloader — Video, GIF & Images | SaveMingo",
  description: "Download supported Reddit-hosted videos, GIF-style media, images and galleries through authorized Reddit API access.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2RedditToolPage kind="all" />;
}
