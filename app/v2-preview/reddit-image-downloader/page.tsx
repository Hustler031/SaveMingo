import type { Metadata } from "next";
import { V2RedditToolPage } from "@/components/v2/V2RedditToolPage";

export const metadata: Metadata = {
  title: "Reddit Image Downloader — Photos & Galleries | SaveMingo",
  description: "Download Reddit-hosted images from supported public image and gallery posts.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2RedditToolPage kind="image" />;
}
