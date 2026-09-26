import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

export type V2PinterestKind = "all" | "video" | "image" | "gif";

const config = {
  all: {
    eyebrow: "Pinterest downloader",
    title: "Download media from Pinterest Pins",
    intro:
      "Paste a public Pinterest Pin URL. SaveMingo’s Pinterest module is built around approved Pinterest API access and returns the media the connected app is permitted to read.",
    section: "Pinterest media through an approved connection.",
    details: [
      "Public Pin URLs",
      "Best image rendition exposed by the API",
      "Video when the app has video access",
      "No Pinterest page scraping",
    ],
  },
  video: {
    eyebrow: "Pinterest video downloader",
    title: "Download Pinterest videos",
    intro:
      "Paste a public video Pin URL. Video download availability depends on the Pinterest API permissions granted to the connected SaveMingo app.",
    section: "Built for public Pinterest video Pins.",
    details: [
      "Public video Pins",
      "Official API access",
      "Best exposed video rendition",
      "No private-content bypass",
    ],
  },
  image: {
    eyebrow: "Pinterest image downloader",
    title: "Download Pinterest images",
    intro:
      "Paste a public image Pin URL. SaveMingo selects the largest image rendition exposed by the approved Pinterest API connection.",
    section: "Save the best image rendition the API exposes.",
    details: [
      "Public image Pins",
      "Largest exposed rendition",
      "Pin-level workflow",
      "No account credentials collected",
    ],
  },
  gif: {
    eyebrow: "Pinterest GIF downloader",
    title: "Download Pinterest GIFs",
    intro:
      "Paste a supported public animated Pin URL. SaveMingo returns the animation media only when the connected Pinterest API exposes it.",
    section: "Animated Pins without scraping Pinterest pages.",
    details: [
      "Public animated Pins",
      "Official API connection",
      "Available animation source only",
      "No scraping fallback",
    ],
  },
} as const;

const related = [
  ["/v2-preview/pinterest-downloader", "All Pinterest"],
  ["/v2-preview/pinterest-video-downloader", "Videos"],
  ["/v2-preview/pinterest-image-downloader", "Images"],
  ["/v2-preview/pinterest-gif-downloader", "GIFs"],
] as const;

export function V2PinterestToolPage({
  kind = "all",
}: {
  kind?: V2PinterestKind;
}) {
  const page = config[kind];

  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-9 text-center sm:px-6 sm:pb-12 sm:pt-11 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          {page.eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.03] tracking-[-0.055em] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          {page.intro}
        </p>

        <div className="mt-6 sm:mt-7">
          <V2Downloader platform="pinterest" />
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-[var(--v2-muted)]">
          Preview integration: Pinterest requires approved API access. These
          pages stay noindex until live media access is verified.
        </p>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-[-0.045em]">
            {page.section}
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.details.map((text) => (
              <article
                key={text}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] font-black text-[var(--v2-accent-strong)]">
                  P
                </div>
                <p className="mt-4 text-sm font-bold leading-6">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-11 text-center sm:px-6">
        <h2 className="text-3xl font-black tracking-[-0.045em]">
          Pinterest download tools
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {related.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface)] px-4 py-2 text-xs font-black text-[var(--v2-muted)] hover:border-[var(--v2-accent)] hover:text-[var(--v2-text)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </V2SiteShell>
  );
}
