import type { Metadata } from "next";
import { V2PlatformToolPage } from "@/components/v2/V2PlatformToolPage";

export const metadata: Metadata = {
  title: "Pinterest GIF Downloader",
  description: "Download supported animated Pinterest media using the source Pinterest exposes.",
  alternates: {
    canonical: "/pinterest-gif-downloader",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Pinterest GIF Downloader | SaveMingo",
    description: "Download supported animated Pinterest media using the source Pinterest exposes.",
    url: "/pinterest-gif-downloader",
  },
};

export default function Page() {
  return <V2PlatformToolPage kind="pinterest-gif" />;
}
