import type { Metadata } from "next";
import { V2XToolPage } from "@/components/v2/V2XToolPage";

export const metadata: Metadata = {
  title: "Twitter GIF Downloader — Save X GIFs as MP4 | SaveMingo",
  description:
    "Save supported animated GIF posts from X or Twitter as the MP4 loop X provides. Public posts only.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V2XToolPage kind="gif" />;
}
