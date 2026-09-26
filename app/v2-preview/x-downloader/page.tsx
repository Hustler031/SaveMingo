import type { Metadata } from "next";
import { V2XToolPage } from "@/components/v2/V2XToolPage";

export const metadata: Metadata = {
  title: "Twitter / X Downloader — Videos, GIFs & Photos | SaveMingo",
  description:
    "Download supported public X or Twitter videos, GIFs and photos. Paste an x.com or twitter.com post link and save the available media.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2XToolPage kind="all" />;
}
