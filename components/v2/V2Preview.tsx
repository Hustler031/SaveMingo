import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

const platforms = [
  {
    title: "Instagram Downloader",
    description: "Download supported public Reels, videos, photos, and carousel posts.",
    href: "/v2-preview/instagram-downloader",
    mark: "IG",
    status: "Available",
    available: true,
  },
  {
    title: "X / Twitter Downloader",
    description: "Download supported public X videos, GIFs, photos, and multi-media posts.",
    href: "/v2-preview/x-downloader",
    mark: "X",
    status: "Available",
    available: true,
  },
  {
    title: "Pinterest Downloader",
    description: "Download supported public Pinterest video and image pins from pin links.",
    href: "/v2-preview/pinterest-downloader",
    mark: "P",
    status: "Available",
    available: true,
  },
  {
    title: "Reddit Downloader",
    description: "Download supported Reddit-hosted videos, images, GIFs, and galleries.",
    href: "/v2-preview/reddit-downloader",
    mark: "r/",
    status: "Available",
    available: true,
  },
  {
    title: "TikTok Downloader",
    description: "A short-form video workflow is planned for a later platform milestone.",
    mark: "♪",
    status: "Coming soon",
    available: false,
  },
  {
    title: "Facebook Downloader",
    description: "Public Facebook media support remains on the roadmap.",
    mark: "f",
    status: "Coming soon",
    available: false,
  },
];

const advantages = [
  [
    "No signup",
    "Paste a supported public Instagram, X, Pinterest, or Reddit link without creating an account.",
  ],
  [
    "Download first",
    "The main action stays obvious. Preview is there only when you choose to open it.",
  ],
  [
    "Works on mobile",
    "SaveMingo is designed for quick use on phones as well as desktop browsers.",
  ],
];

export function V2Preview() {
  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 text-center sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          Save it. Keep it.
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Save anything you{" "}
          <span className="text-[var(--v2-accent)]">find online.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          Instagram, X, Pinterest, and Reddit are available in this preview.
          More platforms can join the same SaveMingo workflow later.
        </p>

        <div className="mt-6 sm:mt-7">
          <V2Downloader />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-[var(--v2-muted)] sm:text-xs">
          <span>✓ No signup</span>
          <span>✓ Public links only</span>
          <span>✓ Preview is optional</span>
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                Platforms
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Download from the apps you use.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              Four platform modules are available in this preview. Each one
              stays isolated so an upstream break does not take down the others.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) =>
              platform.available && platform.href ? (
                <Link
                  key={platform.title}
                  href={platform.href}
                  className="group rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--v2-accent)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
                >
                  <PlatformCard {...platform} />
                </Link>
              ) : (
                <article
                  key={platform.title}
                  className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 opacity-60"
                >
                  <PlatformCard {...platform} />
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
              Why SaveMingo
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Get the file without the clutter.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              Fast actions, clear results, and no unnecessary account flow
              between the link and your download.
            </p>
          </div>

          <div className="divide-y divide-[var(--v2-border)] overflow-hidden rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)]">
            {advantages.map(([title, text]) => (
              <article
                key={title}
                className="grid grid-cols-[2.5rem_1fr] gap-3 p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  ✓
                </div>
                <div>
                  <h3 className="font-black tracking-[-0.02em]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--v2-muted)]">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-surface)]/55">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
              Simple by design
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
              Copy. Paste. Download.
            </h2>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {[
              ["01", "Copy", "Copy a supported public media post or pin link."],
              ["02", "Paste", "Paste the link into SaveMingo."],
              ["03", "Download", "Download immediately or open Preview first."],
            ].map(([number, title, text]) => (
              <article
                key={number}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <p className="font-mono text-xs font-black text-[var(--v2-muted)]">
                  {number}
                </p>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--v2-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </V2SiteShell>
  );
}

function PlatformCard({
  title,
  description,
  mark,
  status,
  available,
}: {
  title: string;
  description: string;
  mark: string;
  status: string;
  available: boolean;
  href?: string;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black",
            available
              ? "bg-[var(--v2-accent-soft)] text-[var(--v2-accent-strong)]"
              : "bg-[var(--v2-surface-2)] text-[var(--v2-muted)]",
          ].join(" ")}
        >
          {mark}
        </div>
        <span
          className={[
            "rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em]",
            available
              ? "border-[var(--v2-accent)]/25 bg-[var(--v2-accent-soft)] text-[var(--v2-accent-strong)]"
              : "border-[var(--v2-border)] bg-[var(--v2-surface-2)] text-[var(--v2-muted)]",
          ].join(" ")}
        >
          {status}
        </span>
      </div>
      <h3 className="mt-5 font-black tracking-[-0.025em]">{title}</h3>
      <p className="mt-1.5 text-sm leading-5 text-[var(--v2-muted)]">
        {description}
      </p>
    </>
  );
}
