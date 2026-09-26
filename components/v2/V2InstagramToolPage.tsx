import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

export type V2InstagramKind = "all" | "reels" | "photo" | "carousel";

const configs: Record<
  V2InstagramKind,
  {
    eyebrow: string;
    title: string;
    intro: string;
    supported: Array<[string, string]>;
    steps: string[];
    faq: Array<[string, string]>;
  }
> = {
  all: {
    eyebrow: "Instagram downloader",
    title: "Download Instagram media",
    intro:
      "Paste a supported public Instagram link to download Reels, videos, photos, or carousel media. Preview is optional.",
    supported: [
      ["Reels", "Public Reel videos through the same resolver flow."],
      ["Videos", "Supported public Instagram video posts."],
      ["Photos", "Supported public single-photo posts."],
      ["Carousels", "Multi-item posts with photos, videos, or both."],
    ],
    steps: [
      "Copy the public Instagram post link.",
      "Paste the link into SaveMingo and press Download.",
      "Download immediately, or open Preview if you want to inspect the media first.",
    ],
    faq: [
      ["Do I need an Instagram login?", "No. SaveMingo works with supported public links and does not ask for your Instagram password."],
      ["Can it download private posts?", "No. SaveMingo does not bypass private-account access controls."],
      ["Is Preview required?", "No. Preview is optional. The download action remains the primary path."],
    ],
  },
  reels: {
    eyebrow: "Instagram Reels",
    title: "Instagram Reels Downloader",
    intro:
      "Paste a supported public Reel link and download the available video without turning the page into a full-screen preview.",
    supported: [
      ["Public Reels", "Designed for supported public Reel links."],
      ["Direct download", "Download remains the primary action after resolve."],
      ["Optional preview", "Open the player only when you want to inspect the Reel."],
      ["Request IDs", "Failures keep diagnostic codes for easier debugging."],
    ],
    steps: [
      "Copy the public Reel link from Instagram.",
      "Paste it into SaveMingo and press Download.",
      "Save the video, or open Preview first if you want to check it.",
    ],
    faq: [
      ["Does it require Instagram login?", "No. SaveMingo is designed around supported public Reel URLs."],
      ["Can I preview the Reel first?", "Yes. Preview is available as a secondary option after the Reel resolves."],
      ["Why can a Reel fail?", "Instagram can change or restrict public responses. SaveMingo returns an error code and request ID when resolution fails."],
    ],
  },
  photo: {
    eyebrow: "Instagram Photos",
    title: "Instagram Photo Downloader",
    intro:
      "Download supported public Instagram photos with a simple copy, paste, and save flow. Preview only when you need it.",
    supported: [
      ["Public photos", "Supported single-photo Instagram posts."],
      ["Source dimensions", "Show real dimensions when the resolver provides them."],
      ["Optional preview", "Inspect the image without making preview the default path."],
      ["Same media route", "Download and preview use SaveMingo's restricted media delivery."],
    ],
    steps: [
      "Copy the public Instagram photo-post link.",
      "Paste it into SaveMingo and press Download.",
      "Save the image, or open Preview to inspect it first.",
    ],
    faq: [
      ["Does SaveMingo edit the image?", "No. SaveMingo aims to deliver the media source that its resolver can obtain."],
      ["Can it access private accounts?", "No. SaveMingo does not bypass private-account permissions."],
      ["Is the image permanently stored?", "The current media delivery path streams resolved media rather than intentionally retaining a permanent copy."],
    ],
  },
  carousel: {
    eyebrow: "Instagram Carousels",
    title: "Instagram Carousel Downloader",
    intro:
      "Resolve a supported multi-item post once, download all available items from the center, and open Preview only if you want to inspect them individually.",
    supported: [
      ["Multiple items", "Resolve several media items from one post URL."],
      ["Mixed media", "Photo and video items can coexist in one result."],
      ["Download all", "The multi-item primary action stays centered and obvious."],
      ["Item preview", "Open Preview for arrows, thumbnails, and individual downloads."],
    ],
    steps: [
      "Copy the public Instagram carousel link.",
      "Paste the single post URL into SaveMingo.",
      "Use Download All, or open Preview for individual carousel items.",
    ],
    faq: [
      ["Do I paste every carousel item?", "No. Paste the public carousel post URL once."],
      ["Can it contain photos and videos?", "Yes. SaveMingo's media model supports mixed image and video results."],
      ["Is Preview mandatory for a carousel?", "No. Download All is the primary result action. Preview is there only when you want item-level control."],
    ],
  },
};

const relatedTools = [
  ["/v2-preview/instagram-downloader", "All Instagram"],
  ["/v2-preview/instagram-reels-downloader", "Reels"],
  ["/v2-preview/instagram-photo-downloader", "Photos"],
  ["/v2-preview/instagram-carousel-downloader", "Carousels"],
] as const;

export function V2InstagramToolPage({ kind }: { kind: V2InstagramKind }) {
  const page = configs[kind];

  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-11 pt-10 text-center sm:px-6 sm:pb-14 sm:pt-13 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          {page.eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.03] tracking-[-0.055em] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          {page.intro}
        </p>

        <div className="mt-7">
          <V2Downloader />
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                Built for this page
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
                Focused Instagram workflow.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              The homepage stays broad; this page keeps the copy and supporting
              information specific to the Instagram tool you opened.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.supported.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  ✓
                </div>
                <h3 className="mt-4 font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-[var(--v2-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-15 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
            Copy. Paste. Download.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
            SaveMingo keeps the visible steps short while resolver and delivery
            details stay behind the interface.
          </p>
        </div>

        <div className="grid gap-3">
          {page.steps.map((step, index) => (
            <article
              key={step}
              className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
            >
              <span className="font-mono text-xs font-black text-[var(--v2-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-bold leading-6">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-surface)]/55">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
              Straight answers.
            </h2>
          </div>

          <div className="mt-7 grid gap-3">
            {page.faq.map(([question, answer]) => (
              <details
                key={question}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] px-5 py-4"
              >
                <summary className="cursor-pointer list-none pr-8 text-sm font-black">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--v2-muted)]">
                  {answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {relatedTools.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface)] px-4 py-2 text-xs font-black text-[var(--v2-muted)] transition hover:border-[var(--v2-accent)] hover:text-[var(--v2-text)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </V2SiteShell>
  );
}
