import type { Metadata } from "next";
import { V2XToolPage } from "@/components/v2/V2XToolPage";

export const metadata: Metadata = {
  title: "X / Twitter Downloader — SaveMingo V2 Preview",
  description:
    "Download supported public X or Twitter videos, GIFs, photos, and media posts with SaveMingo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2XToolPage />;
}
