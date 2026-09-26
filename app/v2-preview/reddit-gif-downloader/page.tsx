import type { Metadata } from "next";
import { V2RedditToolPage } from "@/components/v2/V2RedditToolPage";

export const metadata: Metadata = {
  title: "Reddit GIF Downloader | SaveMingo",
  description: "Download supported Reddit-hosted GIF-style and animated media through authorized API access.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2RedditToolPage kind="gif" />;
}
