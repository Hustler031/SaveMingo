import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Copyright",
  description:
    "Copyright and responsible-use information for SaveMingo's public-link downloader.",
  alternates: { canonical: "/copyright" },
};

export default function CopyrightPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-black tracking-[-0.05em] text-neutral-950">
          Copyright & responsible use
        </h1>
        <div className="mt-7 space-y-5 text-sm leading-7 text-neutral-600">
          <p>
            SaveMingo does not claim ownership of media resolved from third-party
            platforms. Rights remain with the relevant creators and rights
            holders.
          </p>
          <p>
            Download or reuse content only when you have permission or another
            lawful basis to do so. The fact that a post is publicly accessible
            does not automatically grant permission to republish it.
          </p>
          <p>
            The current SaveMingo media route is designed as a transient delivery
            layer rather than a permanent media-hosting library.
          </p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
