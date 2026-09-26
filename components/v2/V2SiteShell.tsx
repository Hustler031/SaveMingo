"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useState } from "react";

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

const navItems = [
  ["/v2-preview", "Home"],
  ["/v2-preview/instagram-downloader", "Instagram"],
  ["/v2-preview/instagram-reels-downloader", "Reels"],
  ["/v2-preview/instagram-photo-downloader", "Photos"],
  ["/v2-preview/instagram-carousel-downloader", "Carousels"],
] as const;

export function V2SiteShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

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
        "--v2-shadow": "0 20px 60px rgba(0,0,0,.22)",
      }
    : {
        "--v2-bg": "#f8f8fb",
        "--v2-bg-soft": "#f1f2f6",
        "--v2-surface": "#ffffff",
        "--v2-surface-2": "#f7f7fa",
        "--v2-text": "#11131a",
        "--v2-muted": "#697082",
        "--v2-border": "#e4e6ec",
        "--v2-accent": "#ef4f7d",
        "--v2-accent-strong": "#d83d6b",
        "--v2-accent-soft": "#fff0f5",
        "--v2-shadow": "0 20px 60px rgba(25,28,38,.07)",
      };

  return (
    <main
      style={themeStyle}
      className="min-h-screen bg-[var(--v2-bg)] text-[var(--v2-text)] transition-colors duration-300"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-13rem] h-[30rem] w-[30rem] rounded-full bg-[var(--v2-accent)] opacity-[0.07] blur-3xl" />
      </div>

      <header className="relative z-30 border-b border-[var(--v2-border)] bg-[var(--v2-bg)]/92 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/v2-preview"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
          >
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
          </Link>

          <button
            type="button"
            onClick={() => setDark((current) => !current)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v2-border)] bg-[var(--v2-surface)] text-[var(--v2-text)] transition hover:-translate-y-0.5 hover:border-[var(--v2-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <nav
          aria-label="Preview navigation"
          className="border-t border-[var(--v2-border)] bg-[var(--v2-surface)]/78"
        >
          <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
            {navItems.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold text-[var(--v2-muted)] transition hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm"
              >
                {label}
              </Link>
            ))}
            <span className="mx-1 h-4 w-px shrink-0 bg-[var(--v2-border)]" />
            <span className="shrink-0 px-3 py-2 text-xs font-bold text-[var(--v2-muted)]/65 sm:text-sm">
              More platforms soon
            </span>
          </div>
        </nav>
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 border-t border-[var(--v2-border)] bg-[var(--v2-surface)]/45">
        <div className="mx-auto grid w-full max-w-6xl gap-7 px-4 py-9 sm:grid-cols-[1.2fr_1fr_1fr] sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg"
              />
              <span className="font-black">SaveMingo</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-5 text-[var(--v2-muted)]">
              Save anything you find online. Save it. Keep it.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              Instagram tools
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-[var(--v2-muted)]">
              <Link href="/v2-preview/instagram-downloader">Instagram Downloader</Link>
              <Link href="/v2-preview/instagram-reels-downloader">Reels Downloader</Link>
              <Link href="/v2-preview/instagram-photo-downloader">Photo Downloader</Link>
              <Link href="/v2-preview/instagram-carousel-downloader">Carousel Downloader</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              Preview status
            </p>
            <div className="mt-3 grid gap-2 text-xs text-[var(--v2-muted)]">
              <span>Instagram · available</span>
              <span>More platforms · planned</span>
              <span>Public links only</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--v2-border)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-[10px] text-[var(--v2-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>SaveMingo V2 design preview.</span>
            <span>Not affiliated with Instagram or Meta.</span>
          </div>
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
