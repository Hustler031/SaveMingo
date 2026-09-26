import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";

const supported = [
  ["Videos", "Download supported public X video posts."],
  ["Photos", "Save supported public image posts from X."],
  ["GIFs", "Animated GIF media is delivered as the available video source."],
  ["Multi-media posts", "Posts with several downloadable media items stay in one result."],
];

const faq = [
  [
    "Do I need to sign in to X?",
    "No. SaveMingo is designed around supported publicly accessible X or Twitter post links.",
  ],
  [
    "Do old twitter.com links work?",
    "Yes. Supported twitter.com post links are normalized to the same X resolver.",
  ],
  [
    "Can SaveMingo download protected posts?",
    "No. SaveMingo does not bypass protected-account or private-access controls.",
  ],
  [
    "Is Preview required?",
    "No. Download remains the primary action. Preview is optional after media resolves.",
  ],
] as const;

export function V2XToolPage() {
  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-9 text-center sm:px-6 sm:pb-12 sm:pt-11 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          X / Twitter downloader
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.03] tracking-[-0.055em] sm:text-5xl">
          Download media from public X posts
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          Paste a supported public x.com or twitter.com post link. SaveMingo
          finds the available video, GIF, photo, or multi-media result without
          requiring an X login.
        </p>

        <div className="mt-6 sm:mt-7">
          <V2Downloader platform="x" />
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                X media
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-[-0.045em]">
                One post link, one clean workflow.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              X is isolated from the Instagram resolver internally, while the
              visible SaveMingo download experience stays consistent.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {supported.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  X
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
            X and Instagram share the same public SaveMingo API contract, but
            each platform resolves independently behind it.
          </p>
        </div>

        <div className="grid gap-3">
          {[
            "Copy a supported public X or Twitter post link.",
            "Paste it into SaveMingo and press Download.",
            "Save the available media, or open Preview if you want to inspect individual items first.",
          ].map((step, index) => (
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
              X downloader basics.
            </h2>
          </div>

          <div className="mt-7 grid gap-3">
            {faq.map(([question, answer]) => (
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
        </div>
      </section>
    </V2SiteShell>
  );
}
