import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest GIF Downloader — SaveMingo V2 Preview",
  description: "Download supported animated Pinterest pin media using the public source Pinterest exposes.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-gif" />;
}
