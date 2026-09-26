import type { Metadata } from "next";
import { V2XToolPage } from "@/components/v2/V2XToolPage";

export const metadata: Metadata = {
  title: "Twitter Video Downloader — Save X Videos | SaveMingo",
  description:
    "Download the highest available MP4 video from a supported public X or Twitter post. No X sign-in required.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2XToolPage kind="video" />;
}
