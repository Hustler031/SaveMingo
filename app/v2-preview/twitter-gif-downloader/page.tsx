import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Twitter GIF Downloader — SaveMingo V2 Preview",
  description: "Download GIF-style media from public Twitter and X posts using the available looping media source.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="x-gif" />;
}
