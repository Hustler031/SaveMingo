"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { V2Downloader } from "@/components/v2/V2Downloader";

type V2ThemeStyle = CSSProperties & {
  "--v2-bg": string;
  "--v2-bg-soft": string;
  "--v2-surface": string;
  "--v2-surface-2": string;
  "--v2-text": string;
  "--v2-muted": string;
  "--v2-border": string;
  "--v2-accent": string;
  "--v2-accent-strong": string;
  "--v2-accent-soft": string;
  "--v2-shadow": string;
};

const capabilities = [
  ["Reels", "Public Instagram reels and short-form video."],
  ["Videos", "Public video posts with real source dimensions."],
  ["Photos", "Clean image preview before you save."],
  ["Carousels", "Browse every item and download individually or together."],
];

const steps = [
  ["01", "Copy the link", "Copy any supported public Instagram post link."],
  ["02", "Paste it", "SaveMingo resolves the public media behind the link."],
  ["03", "Preview & save", "Check the media first, then download what you want."],
];

export function V2Preview() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark((current) => !current);
  }

  const themeStyle: V2ThemeStyle = dark
    ? {
        "--v2-bg": "#090a0f",
        "--v2-bg-soft": "#0f1118",
        "--v2-surface": "#13151d",
        "--v2-surface-2": "#191c26",
        "--v2-text": "#f7f7fb",
        "--v2-muted": "#a4a8b6",
        "--v2-border": "#292d39",
        "--v2-accent": "#ff5b8a",
        "--v2-accent-strong": "#ff78a0",
        "--v2-accent-soft": "#2b1620",
        "--v2-shadow": "0 24px 80px rgba(0,0,0,.28)",
      }
    : {
        "--v2-bg": "#f7f8fb",
        "--v2-bg-soft": "#f0f2f7",
        "--v2-surface": "#ffffff",
        "--v2-surface-2": "#f7f8fb",
        "--v2-text": "#11131a",
        "--v2-muted": "#667085",
        "--v2-border": "#e4e7ee",
        "--v2-accent": "#ef4f7d",
        "--v2-accent-strong": "#d93e6c",
        "--v2-accent-soft": "#fff0f5",
        "--v2-shadow": "0 24px 80px rgba(25, 28, 38, .08)",
      };

  return (
    <main
      style={themeStyle}
      className="min-h-screen bg-[var(--v2-bg)] text-[var(--v2-text)] transition-colors duration-300"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[var(--v2-accent)] opacity-[0.09] blur-3xl" />
        <div className="absolute right-[-9rem] top-[8rem] h-[24rem] w-[24rem] rounded-full bg-fuchsia-400 opacity-[0.05] blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <Image
            src="/icon.svg"
            alt=""
            width={42}
            height={42}
            priority
            className="h-10 w-10 rounded-xl"
          />
          <div>
            <p className="text-[17px] font-black tracking-[-0.035em]">
              SaveMingo
            </p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--v2-muted)]">
              Save it. Keep it.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Light mode" : "Dark mode"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v2-border)] bg-[var(--v2-surface)] text-[var(--v2-text)] transition hover:-translate-y-0.5 hover:border-[var(--v2-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-14 pt-8 text-center sm:px-6 sm:pb-18 sm:pt-14 lg:px-8 lg:pt-18">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface)] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--v2-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--v2-accent)]" />
          Instagram downloader
        </div>

        <h1 className="mt-6 max-w-4xl text-balance text-[2.65rem] font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
          Download Instagram media.
          <span className="mt-2 block text-[var(--v2-accent)]">
            Clean. Fast. Simple.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-lg sm:leading-7">
          Paste a public Instagram link to preview and save Reels, videos,
          photos, and carousels without signup or clutter.
        </p>

        <div className="mt-8 w-full sm:mt-10">
          <V2Downloader />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[var(--v2-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon /> No signup
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon /> Public links only
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon /> Real media preview
          </span>
        </div>
      </section>

      <section className="relative z-10 border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
              Everything in one flow
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Preview first. Download second.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--v2-muted)] sm:text-base">
              The result area is designed around the media itself instead of
              turning your download into a list of anonymous file rows.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-[var(--v2-accent-strong)]">
                  <MediaIcon />
                </div>
                <h3 className="font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-[var(--v2-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
              Three steps
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Copy. Paste. Save.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              Nothing complicated between the Instagram link and your media.
            </p>
          </div>

          <div className="grid gap-3">
            {steps.map(([number, title, text]) => (
              <article
                key={number}
                className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5 sm:p-6"
              >
                <span className="font-mono text-xs font-bold text-[var(--v2-muted)]">
                  {number}
                </span>
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--v2-muted)]">
                    {text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--v2-border)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-xs text-[var(--v2-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/icon.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg"
            />
            <span className="font-extrabold text-[var(--v2-text)]">SaveMingo</span>
          </div>
          <p>Public links only · Not affiliated with Instagram or Meta.</p>
        </div>
      </footer>
    </main>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M20.1 15.7A8.4 8.4 0 0 1 8.3 3.9 8.5 8.5 0 1 0 20.1 15.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[var(--v2-accent)]" fill="none" aria-hidden="true">
      <path d="m4.5 10.2 3.2 3.2 7.8-7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <path d="m6.5 17 4.2-4.4 2.8 2.7 1.9-1.9 2.1 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
