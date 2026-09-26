import type { Metadata } from "next";
import { V2Preview } from "@/components/v2/V2Preview";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "SaveMingo — Social Media Downloader for Public Links" },
  description:
    "Download supported public social media videos, photos, GIFs, and carousels with SaveMingo. Clean, fast, no signup.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "SaveMingo — Social Media Downloader for Public Links",
    description:
      "A clean downloader for supported public social media videos, photos, GIFs, and carousels.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "SaveMingo",
      url: SITE_URL,
      description:
        "A clean downloader for supported public social media content.",
    },
    {
      "@type": "WebApplication",
      name: "SaveMingo",
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <V2Preview />
    </>
  );
}
