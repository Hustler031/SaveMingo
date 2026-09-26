import type { Metadata } from "next";
import Link from "next/link";
import { Downloader } from "@/components/downloader/Downloader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "How to Download Instagram Reels",
  description:
    "A simple step-by-step guide to saving supported public Instagram Reels with SaveMingo.",
  alternates: { canonical: "/how-to-download-instagram-reels" },
};

export default function HowToDownloadInstagramReelsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <article className="mx-auto w-full max-w-4xl px-5 pb-18 pt-10 sm:px-8 sm:pt-16">
        <p className="text-xs font-black tracking-[0.15em] text-[var(--accent-strong)] uppercase">
          Guide
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-neutral-950 sm:text-5xl">
          How to download a public Instagram Reel with SaveMingo
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-600">
          SaveMingo uses a simple copy, paste, and save flow. It is designed for
          publicly accessible Instagram links and does not require your
          Instagram password.
        </p>

        <div className="mt-10 grid gap-4">
          {[
            [
              "1",
              "Copy the Reel link",
              "Open the public Reel, use Instagram's share option, and copy the post URL.",
            ],
            [
              "2",
              "Paste it into SaveMingo",
              "Paste the URL into the downloader below and select Get media.",
            ],
            [
              "3",
              "Wait for the resolver",
              "SaveMingo validates the link and asks its Instagram resolver for the available media.",
            ],
            [
              "4",
              "Download the video",
              "If the public Reel resolves successfully, use the Download button on the video result.",
            ],
          ].map(([number, title, text]) => (
            <section
              key={number}
              className="rounded-[24px] border border-neutral-200 bg-white/80 p-6 shadow-sm"
            >
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-white">
                  {number}
                </span>
                <div>
                  <h2 className="text-lg font-black text-neutral-950">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <Downloader />
        </div>

        <section className="mt-14 rounded-[28px] border border-neutral-200 bg-white/70 p-6 sm:p-8">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">
            If a Reel does not resolve
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            Check that the post is public and the copied link opens normally.
            If SaveMingo shows an error, keep the error code and request ID.
            Those identifiers make it much easier to diagnose the exact failure.
          </p>
          <Link
            href="/instagram-reels-downloader"
            className="mt-5 inline-flex rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-black text-white"
          >
            Open Reels Downloader
          </Link>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
