import { redirect } from "next/navigation";

export default function LegacyV2PreviewRedirect() {
  redirect("/reddit-video-downloader");
}
