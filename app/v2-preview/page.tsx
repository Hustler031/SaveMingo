import type { Metadata } from "next";
import { V2Preview } from "@/components/v2/V2Preview";

export const metadata: Metadata = {
  title: "SaveMingo UI V2 Preview",
  description: "Private design preview for the SaveMingo UI V2 workstream.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function V2PreviewPage() {
  return <V2Preview />;
}
