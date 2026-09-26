import type { Metadata } from "next";
import { V2RedditToolPage } from "@/components/v2/V2RedditToolPage";

export const metadata: Metadata = {
  title: "Reddit Video Downloader | SaveMingo",
  description: "Download the Reddit-hosted video source from a supported public post. Audio merging is not enabled in this preview.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2RedditToolPage kind="video" />;
}
