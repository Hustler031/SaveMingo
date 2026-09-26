import type { Metadata } from "next";
import { V2XToolPage } from "@/components/v2/V2XToolPage";

export const metadata: Metadata = {
  title: "Twitter Image Downloader — Save X Photos | SaveMingo",
  description:
    "Download photos from supported public X or Twitter posts, including multi-photo posts when available.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2XToolPage kind="image" />;
}
