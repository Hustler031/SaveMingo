import type { Metadata } from "next";
import Link from "next/link";
import { Downloader } from "@/components/downloader/Downloader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "SaveMingo — Save anything you find online",
  description:
    "Save public social media content with SaveMingo. Instagram downloader support comes first.",
  alternates: {
    canonical: "/",
  },
};

const capabilities = [
  ["Reels", "Public Instagram Reel links."],
  ["Videos", "Public Instagram video posts."],
  ["Photos", "Public Instagram photo posts."],
  ["Carousels", "Multi-item public posts."],
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/75 px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-pink-700 uppercase shadow-sm">
          Clean downloads. No clutter.
        </div>

        <h1 className="max-w-4xl text-balance text-5xl font-black tracking-[-0.055em] text-neutral-950 sm:text-7xl">
          Save anything you
          <span className="block text-[var(--accent-strong)]">find online.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-neutral-600 sm:text-lg">
          SaveMingo is a simple way to save public social media content.
          Instagram comes first, with more platforms planned behind the same
          clean workflow.
        </p>

        <div className="mt-10 w-full">
          <Downloader compact />
        </div>

        <Link
          href="/instagram-downloader"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-[var(--accent-strong)] transition hover:bg-[var(--accent-soft)]"
        >
          Open Instagram Downloader <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/55">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black tracking-[0.15em] text-[var(--accent-strong)] uppercase">
                Instagram first
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-neutral-950 sm:text-4xl">
                One paste box. Multiple content types.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-neutral-600 lg:justify-self-end">
              SaveMingo is structured around one resolver-ready interface, so
              the visible experience stays simple even as more content types and
              platforms are added later.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, text]) => (
              <div
                key={title}
                className="rounded-[22px] border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-sm font-black text-[var(--accent-strong)]">
                  ↘
                </div>
                <h3 className="font-black text-neutral-950">{title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black tracking-[0.15em] text-[var(--accent-strong)] uppercase">
              Three steps
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-neutral-950">
              Save it. Keep it.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">
              Copy a supported public link, paste it into SaveMingo, and choose
              the resolved media. The complexity stays behind the interface.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              ["01", "Copy", "Copy the public Instagram link."],
              ["02", "Paste", "Paste it into the SaveMingo input."],
              ["03", "Save", "Choose the resolved media and download."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="grid grid-cols-[3rem_1fr] gap-4 rounded-[24px] border border-neutral-200 bg-white/80 p-5"
              >
                <div className="text-sm font-black text-neutral-400">
                  {number}
                </div>
                <div>
                  <h3 className="font-black text-neutral-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
