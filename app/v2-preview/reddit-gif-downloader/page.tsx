import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Reddit GIF Downloader — SaveMingo V2 Preview",
  description: "Download supported Reddit-hosted GIF and animated media from public Reddit posts.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="reddit-gif" />;
}
