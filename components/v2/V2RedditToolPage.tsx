import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

export type V2RedditKind = "all" | "video" | "gif" | "image";

const configs = {
  all: {
    eyebrow: "Reddit downloader",
    title: "Download media from Reddit posts",
    intro:
      "Paste a supported public Reddit post link. SaveMingo’s Reddit module is built for authorized Reddit API access and can return Reddit-hosted videos, GIF-style media, images, and galleries.",
    section: "One Reddit post link, only the media Reddit exposes.",
    details: [
      "Reddit-hosted videos",
      "Images and galleries",
      "GIF-style media",
      "No private-content bypass",
    ],
  },
  video: {
    eyebrow: "Reddit video downloader",
    title: "Download Reddit videos",
    intro:
      "Paste a supported public Reddit video post. SaveMingo can return Reddit’s downloadable video source when authorized API access is configured.",
    section: "Video source first. Audio claims only when verified.",
    details: [
      "v.redd.it video source",
      "Public posts only",
      "Optional preview",
      "Audio muxing not enabled yet",
    ],
  },
  gif: {
    eyebrow: "Reddit GIF downloader",
    title: "Download Reddit GIF-style media",
    intro:
      "Paste a supported public Reddit post containing GIF-style or animated Reddit-hosted media. SaveMingo returns the media source exposed through the approved API.",
    section: "Animated Reddit media without scraping.",
    details: [
      "Reddit-hosted animations",
      "API-authorized access",
      "Public posts only",
      "No page scraping fallback",
    ],
  },
  image: {
    eyebrow: "Reddit image downloader",
    title: "Download Reddit images and galleries",
    intro:
      "Paste a supported public Reddit image or gallery post. SaveMingo can return individual Reddit-hosted images from the post or gallery.",
    section: "Images and galleries in one focused tool.",
    details: [
      "Single-image posts",
      "Multi-image galleries",
      "Reddit-hosted media only",
      "Individual item downloads",
    ],
  },
} as const;

const related = [
  ["/v2-preview/reddit-downloader", "All Reddit media"],
  ["/v2-preview/reddit-video-downloader", "Videos"],
  ["/v2-preview/reddit-gif-downloader", "GIFs"],
  ["/v2-preview/reddit-image-downloader", "Images & galleries"],
] as const;

export function V2RedditToolPage({
  kind = "all",
}: {
  kind?: V2RedditKind;
}) {
  const page = configs[kind];

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
          <V2Downloader platform="reddit" />
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-[var(--v2-muted)]">
          Preview integration: Reddit API access must be authorized for this
          use case. These pages remain noindex until access and live downloads
          are verified.
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  r/
                </div>
                <p className="mt-4 text-sm font-bold leading-6">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {kind === "video" && (
        <section className="mx-auto w-full max-w-4xl px-4 pt-11 sm:px-6">
          <div className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 text-left">
            <h2 className="text-lg font-black">
              Does the Reddit video downloader include sound?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--v2-muted)]">
              Not yet in this preview. Reddit commonly exposes video and audio
              as separate streams. SaveMingo will only advertise “with sound”
              after a reliable merge path is implemented and tested.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-4xl px-4 py-11 text-center sm:px-6">
        <h2 className="text-3xl font-black tracking-[-0.045em]">
          Reddit download tools
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
