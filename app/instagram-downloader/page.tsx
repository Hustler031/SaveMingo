import type { Metadata } from "next";
import { Downloader } from "@/components/downloader/Downloader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Instagram Downloader",
  description:
    "Save public Instagram Reels, videos, photos, and posts with SaveMingo's clean Instagram downloader.",
  alternates: {
    canonical: "/instagram-downloader",
  },
  openGraph: {
    title: "Instagram Downloader | SaveMingo",
    description:
      "A clean, simple downloader for public Instagram Reels, videos, photos, and posts.",
    url: "https://savemingo.com/instagram-downloader",
  },
};

const supported = [
  {
    name: "Reels",
    mark: "▶",
    text: "Recognize public Instagram Reel links and prepare them for media resolution.",
  },
  {
    name: "Videos",
    mark: "◉",
    text: "A focused flow for public Instagram video posts without account signup.",
  },
  {
    name: "Photos",
    mark: "▣",
    text: "The same simple paste flow will handle public photo posts.",
  },
  {
    name: "Carousels",
    mark: "▦",
    text: "Multi-item public posts will return each available media item separately.",
  },
];

const faq = [
  [
    "Does SaveMingo require an Instagram login?",
    "No. V1 is designed around public Instagram links and does not ask for your Instagram password.",
  ],
  [
    "Can it download private Instagram posts?",
    "No. SaveMingo is being built for publicly accessible links and does not bypass private-account controls.",
  ],
  [
    "Will photos and carousel posts use a different tool?",
    "No. The goal is one clean input. SaveMingo detects the supported Instagram link type behind the same interface.",
  ],
  [
    "Why does this preview only check my link?",
    "Day 2 is the resolver-ready interface milestone. The real media resolver is connected in the next implementation stage.",
  ],
];

export default function InstagramDownloaderPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 text-center sm:px-8 sm:pb-20 sm:pt-16">
        <p className="text-xs font-black tracking-[0.16em] text-[var(--accent-strong)] uppercase">
          Instagram · V1
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-black tracking-[-0.05em] text-neutral-950 sm:text-6xl">
          Instagram Downloader
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-7 text-neutral-600 sm:text-lg">
          One clean place for public Instagram Reels, videos, photos, and
          carousel posts. Paste the link and let SaveMingo handle the rest.
        </p>

        <div className="mt-9 sm:mt-11">
          <Downloader />
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/55">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
                One input
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950">
                Built for the Instagram formats people actually save.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-neutral-600">
              The resolver will identify the exact media type after the link
              passes this frontend validation layer.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supported.map((item) => (
              <article
                key={item.name}
                className="rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-black text-[var(--accent-strong)]">
                  {item.mark}
                </div>
                <h3 className="mt-7 text-lg font-black tracking-[-0.03em] text-neutral-950">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950">
            Copy. Paste. Save.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">
            SaveMingo keeps the visible workflow simple while the validation,
            resolver, diagnostics, and error handling stay modular underneath.
          </p>
        </div>

        <div className="grid gap-3">
          {[
            ["01", "Copy the public Instagram link"],
            ["02", "Paste it into SaveMingo"],
            ["03", "Choose the resolved media and download"],
          ].map(([number, text]) => (
            <div
              key={number}
              className="flex items-center gap-4 rounded-[22px] border border-neutral-200 bg-white/80 px-5 py-5 shadow-sm"
            >
              <span className="font-mono text-xs font-bold text-neutral-400">
                {number}
              </span>
              <p className="text-sm font-extrabold text-neutral-800">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-neutral-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-pink-300 uppercase">
              Clear limits
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              Public links only.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-300">
            SaveMingo V1 is designed for publicly accessible Instagram content.
            It does not ask for Instagram credentials and is not designed to
            bypass private-account access controls.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950">
            Straight answers.
          </h2>
        </div>

        <div className="mt-8 grid gap-3">
          {faq.map(([question, answer]) => (
            <details
              key={question}
              className="group rounded-[22px] border border-neutral-200 bg-white/80 px-5 py-4 shadow-sm"
            >
              <summary className="cursor-pointer list-none pr-8 text-sm font-black text-neutral-950 marker:hidden">
                {question}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
