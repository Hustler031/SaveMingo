import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

const tools = [
  {
    title: "Instagram Downloader",
    description: "Reels, videos, photos and carousel posts.",
    href: "/v2-preview/instagram-downloader",
    mark: "IG",
    status: "Available",
  },
  {
    title: "Instagram Reels",
    description: "Save supported public Reel videos.",
    href: "/v2-preview/instagram-reels-downloader",
    mark: "▶",
    status: "Available",
  },
  {
    title: "Instagram Photos",
    description: "Save supported public photo posts.",
    href: "/v2-preview/instagram-photo-downloader",
    mark: "▣",
    status: "Available",
  },
  {
    title: "Instagram Carousels",
    description: "Handle multi-item posts in one flow.",
    href: "/v2-preview/instagram-carousel-downloader",
    mark: "▦",
    status: "Available",
  },
  {
    title: "TikTok Downloader",
    description: "Short-form video downloader.",
    mark: "♪",
    status: "Coming soon",
  },
  {
    title: "Facebook Video",
    description: "Public video download workflow.",
    mark: "f",
    status: "Coming soon",
  },
  {
    title: "X / Twitter Video",
    description: "Public video and media posts.",
    mark: "X",
    status: "Coming soon",
  },
  {
    title: "More platforms",
    description: "New adapters can plug into the same workflow.",
    mark: "+",
    status: "Planned",
  },
];

const advantages = [
  ["No signup", "Paste a supported public link and continue without creating an account."],
  ["Preview when you want", "Download stays primary. Media preview remains optional instead of taking over the page."],
  ["One clean workflow", "The same simple pattern can support more platforms as SaveMingo expands."],
  ["Mobile first", "Large tap targets, compact sections, horizontal navigation and responsive result states."],
];

export function V2Preview() {
  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          Save it. Keep it.
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
          Save anything you find online.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          One clean place for supported public media links. Instagram works
          first; more platforms can join the same SaveMingo workflow later.
        </p>

        <div className="mt-7 sm:mt-8">
          <V2Downloader />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-[var(--v2-muted)] sm:text-xs">
          <span>✓ No signup</span>
          <span>✓ Public links</span>
          <span>✓ Instagram available now</span>
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                Downloaders
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Everything starts from here.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              The homepage is the hub. Each platform gets its own focused page
              while keeping the same SaveMingo interaction model.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) =>
              tool.href ? (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--v2-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
                >
                  <ToolCard {...tool} />
                </Link>
              ) : (
                <article
                  key={tool.title}
                  className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 opacity-75"
                >
                  <ToolCard {...tool} />
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
              Why SaveMingo
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              A downloader should stay out of your way.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              The UI keeps the main action obvious and puts extra controls
              behind deliberate choices instead of filling the screen.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {advantages.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  ✓
                </div>
                <h3 className="mt-4 font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--v2-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-surface)]/55">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
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
              ["01", "Copy", "Copy a supported public media link."],
              ["02", "Paste", "Paste it into the SaveMingo box."],
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

function ToolCard({
  title,
  description,
  mark,
  status,
}: {
  title: string;
  description: string;
  mark: string;
  status: string;
  href?: string;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
          {mark}
        </div>
        <span className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--v2-muted)]">
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
