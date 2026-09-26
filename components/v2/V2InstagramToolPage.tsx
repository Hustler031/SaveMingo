import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

export type V2InstagramKind =
  | "all"
  | "reels"
  | "video"
  | "photo"
  | "carousel";

const configs: Record<
  V2InstagramKind,
  {
    eyebrow: string;
    title: string;
    intro: string;
    sectionTitle: string;
    sectionText: string;
    supported: Array<[string, string]>;
    steps: string[];
    faq: Array<[string, string]>;
  }
> = {
  all: {
    eyebrow: "Instagram downloader",
    title: "Download Instagram media",
    intro:
      "Paste one supported public Instagram link. SaveMingo detects whether it is a Reel, video, photo, or carousel and prepares the available download.",
    sectionTitle: "Everything you need for Instagram downloads.",
    sectionText:
      "Use one box for supported public Instagram links. You do not need to choose the post type before pasting.",
    supported: [
      ["Reels", "Download supported public Reel videos."],
      ["Videos", "Save supported public Instagram video posts."],
      ["Photos", "Download supported public single-photo posts."],
      ["Carousels", "Save available photos and videos from multi-item posts."],
    ],
    steps: [
      "Copy the public Instagram post link.",
      "Paste the link into SaveMingo and press Download.",
      "Save the available media immediately, or open Preview if you want to inspect it first.",
    ],
    faq: [
      [
        "Do I need an Instagram login?",
        "No. SaveMingo works with supported public links and does not ask for your Instagram password.",
      ],
      [
        "Can it download private posts?",
        "No. SaveMingo does not bypass private-account access controls.",
      ],
      [
        "Do I need to choose Reel, photo, or carousel first?",
        "No. Paste the supported public Instagram link and SaveMingo determines the post type automatically.",
      ],
      [
        "Is Preview required?",
        "No. Preview is optional. Download remains the primary action.",
      ],
    ],
  },
  reels: {
    eyebrow: "Instagram Reels",
    title: "Instagram Reels Downloader",
    intro:
      "Paste a supported public Reel link and download the available video. Preview stays optional.",
    sectionTitle: "Made for quick Reel downloads.",
    sectionText:
      "Copy the Reel link, paste it once, and keep the download action front and center.",
    supported: [
      ["Public Reels", "Works with supported publicly accessible Reel links."],
      ["Direct download", "The available video is presented as the main action."],
      ["Optional preview", "Open the player only when you want to check the Reel first."],
      ["Clear errors", "If a Reel cannot be resolved, SaveMingo shows a useful error code and request ID."],
    ],
    steps: [
      "Copy the public Reel link from Instagram.",
      "Paste it into SaveMingo and press Download.",
      "Save the video, or open Preview first if you want to check it.",
    ],
    faq: [
      [
        "Does it require an Instagram login?",
        "No. SaveMingo is designed for supported public Reel URLs.",
      ],
      [
        "Can I preview the Reel first?",
        "Yes. Preview is available after the Reel resolves, but it is not required.",
      ],
      [
        "Why can a Reel occasionally fail?",
        "Instagram can change or temporarily restrict public responses. SaveMingo shows an error code and request ID when that happens.",
      ],
    ],
  },
  video: {
    eyebrow: "Instagram Videos",
    title: "Instagram Video Downloader",
    intro:
      "Paste a supported public Instagram video-post link and save the available video with the same simple workflow.",
    sectionTitle: "A simple path from post to video.",
    sectionText:
      "No separate setup or category choice is needed. Paste the supported public video-post link and continue.",
    supported: [
      ["Public video posts", "Designed for supported public Instagram video-post links."],
      ["Direct download", "Download is the main action once the media is ready."],
      ["Optional preview", "Open Preview only when you want to inspect the video."],
      ["Mobile friendly", "The same flow is designed to stay usable on smaller screens."],
    ],
    steps: [
      "Copy the public Instagram video-post link.",
      "Paste it into SaveMingo and press Download.",
      "Save the video immediately, or open Preview first.",
    ],
    faq: [
      [
        "Is this different from the Reel downloader?",
        "The page is specific to video posts, but the visible SaveMingo workflow stays the same.",
      ],
      [
        "Do I need to sign in?",
        "No. SaveMingo does not ask for Instagram login credentials.",
      ],
      [
        "Can I preview the video?",
        "Yes. Preview is optional after the media resolves.",
      ],
    ],
  },
  photo: {
    eyebrow: "Instagram Photos",
    title: "Instagram Photo Downloader",
    intro:
      "Download supported public Instagram photos with a simple copy, paste, and save flow.",
    sectionTitle: "Save public Instagram photos without extra steps.",
    sectionText:
      "Paste the supported photo-post link, download the image, and use Preview only when you want to inspect it first.",
    supported: [
      ["Public photos", "Works with supported public single-photo Instagram posts."],
      ["Image details", "Available dimensions are shown when they are provided."],
      ["Optional preview", "Inspect the image only when you choose to open Preview."],
      ["No signup", "No SaveMingo account is required for the download flow."],
    ],
    steps: [
      "Copy the public Instagram photo-post link.",
      "Paste it into SaveMingo and press Download.",
      "Save the image, or open Preview if you want to inspect it first.",
    ],
    faq: [
      [
        "Does SaveMingo edit the image?",
        "No. SaveMingo is designed to deliver the available resolved media without applying filters or edits.",
      ],
      [
        "Can it access private accounts?",
        "No. SaveMingo does not bypass private-account permissions.",
      ],
      [
        "Is Preview required?",
        "No. The image can be downloaded directly after it resolves.",
      ],
    ],
  },
  carousel: {
    eyebrow: "Instagram Carousels",
    title: "Instagram Carousel Downloader",
    intro:
      "Paste one supported public carousel link, download all available items together, or open Preview for item-by-item control.",
    sectionTitle: "One link for the whole carousel.",
    sectionText:
      "You do not need to paste every slide separately. SaveMingo can present the available items from the supported public post together.",
    supported: [
      ["Multiple items", "Handle several available items from one carousel post."],
      ["Photos and videos", "Supported carousels can contain image and video items."],
      ["Download all", "Use one primary action for the available carousel items."],
      ["Item preview", "Open Preview for arrows, thumbnails, and individual downloads."],
    ],
    steps: [
      "Copy the public Instagram carousel link.",
      "Paste the single post URL into SaveMingo.",
      "Use Download All, or open Preview for individual carousel items.",
    ],
    faq: [
      [
        "Do I need to paste every carousel item?",
        "No. Paste the supported public carousel post URL once.",
      ],
      [
        "Can a carousel contain photos and videos?",
        "Yes. Supported carousel results can include both images and videos.",
      ],
      [
        "Is Preview mandatory?",
        "No. Download All remains the primary action. Preview is optional for item-level control.",
      ],
    ],
  },
};

const relatedTools = [
  ["/v2-preview/instagram-downloader", "All Instagram"],
  ["/v2-preview/instagram-reels-downloader", "Reels"],
  ["/v2-preview/instagram-video-downloader", "Videos"],
  ["/v2-preview/instagram-photo-downloader", "Photos"],
  ["/v2-preview/instagram-carousel-downloader", "Carousels"],
] as const;

export function V2InstagramToolPage({ kind }: { kind: V2InstagramKind }) {
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
          <V2Downloader />
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                Instagram
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-[-0.045em]">
                {page.sectionTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              {page.sectionText}
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

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-11 sm:px-6 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
            Copy. Paste. Download.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
            Three simple steps from a supported public Instagram link to the
            available media.
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
        <div className="mx-auto w-full max-w-4xl px-4 py-11 sm:px-6 sm:py-13">
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
