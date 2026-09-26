import Link from "next/link";
import { Downloader } from "@/components/downloader/Downloader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  faqJsonLd,
  type InstagramSeoPage,
} from "@/lib/seo/instagram-pages";

const siblingPages = [
  ["/instagram-downloader", "All Instagram"],
  ["/instagram-reels-downloader", "Reels"],
  ["/instagram-video-downloader", "Videos"],
  ["/instagram-photo-downloader", "Photos"],
  ["/instagram-carousel-downloader", "Carousels"],
] as const;

export function InstagramLandingPage({
  page,
}: {
  page: InstagramSeoPage;
}) {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(page)).replace(/</g, "\\u003c"),
        }}
      />

      <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-10 text-center sm:px-8 sm:pb-18 sm:pt-16">
        <p className="text-xs font-black tracking-[0.16em] text-[var(--accent-strong)] uppercase">
          {page.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-black tracking-[-0.05em] text-neutral-950 sm:text-6xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-7 text-neutral-600 sm:text-lg">
          {page.intro}
        </p>

        <div className="mt-9 sm:mt-11">
          <Downloader />
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/55">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            {page.highlights.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-black text-[var(--accent-strong)]">
                    ✓
                  </span>
                  <p className="text-sm font-extrabold leading-6 text-neutral-800">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-18 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
            How to use it
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950">
            Copy. Paste. Save.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">
            {page.contentType} use the same SaveMingo flow, which keeps the
            interface consistent while platform-specific logic stays behind the
            resolver API.
          </p>
        </div>

        <div className="grid gap-3">
          {page.steps.map((step, index) => (
            <div
              key={step}
              className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-[22px] border border-neutral-200 bg-white/80 px-5 py-5 shadow-sm"
            >
              <span className="font-mono text-xs font-bold text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-extrabold leading-6 text-neutral-800">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-neutral-950 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black tracking-[0.14em] text-pink-300 uppercase">
              Public links only
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              No private-account bypass.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-neutral-300">
            SaveMingo does not ask for Instagram credentials and is not designed
            to bypass access controls. Media availability depends on the link
            being public and on the upstream response being available.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-18 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-neutral-950">
            Useful answers before you paste.
          </h2>
        </div>

        <div className="mt-8 grid gap-3">
          {page.faq.map(([question, answer]) => (
            <details
              key={question}
              className="rounded-[22px] border border-neutral-200 bg-white/80 px-5 py-4 shadow-sm"
            >
              <summary className="cursor-pointer list-none pr-8 text-sm font-black text-neutral-950">
                {question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {siblingPages.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-extrabold text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:text-neutral-950"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
