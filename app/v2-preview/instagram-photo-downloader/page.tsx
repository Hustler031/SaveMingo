import type { Metadata } from "next";
import { V2InstagramToolPage } from "@/components/v2/V2InstagramToolPage";

export const metadata: Metadata = {
  title: "Instagram Photo Downloader — SaveMingo V2 Preview",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2InstagramToolPage kind="photo" />;
}
