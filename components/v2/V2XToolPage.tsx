import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

export type V2XKind = "all" | "video" | "gif" | "image";

const configs = {
  all: {
    eyebrow: "X / Twitter downloader",
    title: "Download videos, GIFs and photos from X",
    intro: "Paste a supported public x.com or twitter.com post link. SaveMingo detects the available video, animated GIF, photo, or multi-media result automatically.",
    section: "One X post link. Every supported media type.",
    details: ["Highest available MP4 video variant", "Animated GIFs saved as MP4 loops", "Full-size photos when X exposes them", "Multi-media posts in one result"],
  },
  video: {
    eyebrow: "Twitter video downloader",
    title: "Download X / Twitter videos",
    intro: "Paste a public X or Twitter post containing video. SaveMingo selects the highest-bitrate MP4 variant X exposes for that post.",
    section: "Video first, without extra format guessing.",
    details: ["x.com and twitter.com links", "Highest published MP4 bitrate", "No X sign-in", "Optional preview before saving"],
  },
  gif: {
    eyebrow: "Twitter GIF downloader",
    title: "Download X / Twitter GIFs",
    intro: "Animated GIF posts on X are commonly delivered as short MP4 loops. SaveMingo finds that available video source and saves the animation cleanly.",
    section: "Save the animation X actually serves.",
    details: ["GIF-style posts", "MP4 loop output", "Public posts only", "No account required"],
  },
  image: {
    eyebrow: "Twitter image downloader",
    title: "Download photos from X / Twitter",
    intro: "Paste a public X post containing one or more photos. SaveMingo returns the available image media instead of a cropped timeline screenshot.",
    section: "Save photos from the post itself.",
    details: ["Single-photo posts", "Multi-photo posts", "Full-size source when exposed", "Individual or multi-item download"],
  },
} as const;

const related = [
  ["/v2-preview/x-downloader", "All X media"],
  ["/v2-preview/twitter-video-downloader", "Videos"],
  ["/v2-preview/twitter-gif-downloader", "GIFs"],
  ["/v2-preview/twitter-image-downloader", "Images"],
] as const;

export function V2XToolPage({ kind = "all" }: { kind?: V2XKind }) {
  const page = configs[kind];

  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-9 text-center sm:px-6 sm:pb-12 sm:pt-11 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">{page.eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.03] tracking-[-0.055em] sm:text-5xl">{page.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">{page.intro}</p>
        <div className="mt-6 sm:mt-7"><V2Downloader platform="x" /></div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-[-0.045em]">{page.section}</h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.details.map((text) => (
              <article key={text} className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] font-black text-[var(--v2-accent-strong)]">X</div>
                <p className="mt-4 text-sm font-bold leading-6">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-11 text-center sm:px-6">
        <h2 className="text-3xl font-black tracking-[-0.045em]">Related X download tools</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {related.map(([href,label]) => (
            <Link key={href} href={href} className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface)] px-4 py-2 text-xs font-black text-[var(--v2-muted)] hover:border-[var(--v2-accent)] hover:text-[var(--v2-text)]">{label}</Link>
          ))}
        </div>
      </section>
    </V2SiteShell>
  );
}
