"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const xTools = [
  ["/v2-preview/twitter-video-downloader", "Video Downloader"],
  ["/v2-preview/twitter-gif-downloader", "GIF Downloader"],
  ["/v2-preview/twitter-image-downloader", "Image Downloader"],
] as const;

const redditTools = [
  ["/v2-preview/reddit-video-downloader", "Video Downloader"],
  ["/v2-preview/reddit-gif-downloader", "GIF Downloader"],
  ["/v2-preview/reddit-image-downloader", "Image & Gallery Downloader"],
] as const;

const pinterestTools = [
  ["/v2-preview/pinterest-video-downloader", "Video Downloader"],
  ["/v2-preview/pinterest-image-downloader", "Image Downloader"],
  ["/v2-preview/pinterest-gif-downloader", "GIF Downloader"],
] as const;

const instagramTools = [
  ["/v2-preview/instagram-reels-downloader", "Reels Downloader"],
  ["/v2-preview/instagram-video-downloader", "Video Downloader"],
  ["/v2-preview/instagram-photo-downloader", "Photo Downloader"],
  ["/v2-preview/instagram-carousel-downloader", "Carousel Downloader"],
] as const;

export function V2SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [instagramMenuOpen, setInstagramMenuOpen] = useState(false);
  const [xMenuOpen, setXMenuOpen] = useState(false);
  const [pinterestMenuOpen, setPinterestMenuOpen] = useState(false);
  const [redditMenuOpen, setRedditMenuOpen] = useState(false);

  const homeActive = pathname === "/v2-preview";
  const instagramActive = pathname.startsWith("/v2-preview/instagram");
  const xActive =
    pathname.startsWith("/v2-preview/x") ||
    pathname.startsWith("/v2-preview/twitter-");
  const pinterestActive = pathname.startsWith("/v2-preview/pinterest");
  const redditActive = pathname.startsWith("/v2-preview/reddit");

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
          aria-label="Primary navigation"
          className="border-t border-[var(--v2-border)] bg-[var(--v2-surface)]/82"
        >
          <div className="mx-auto flex h-[48px] w-full max-w-6xl items-center gap-1 overflow-x-auto px-3 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
            <Link
              href="/v2-preview"
              className={[
                "relative rounded-lg px-3 py-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm",
                homeActive
                  ? "text-[var(--v2-text)]"
                  : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
              ].join(" ")}
            >
              Home
              {homeActive && (
                <span className="absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-[var(--v2-accent)]" />
              )}
            </Link>

            <div className="relative flex items-center">
              <Link
                href="/v2-preview/instagram-downloader"
                className={[
                  "relative rounded-l-lg py-2 pl-3 pr-2 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm",
                  instagramActive
                    ? "text-[var(--v2-text)]"
                    : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
                ].join(" ")}
              >
                Instagram
                {instagramActive && (
                  <span className="absolute left-3 right-0 -bottom-[7px] h-0.5 rounded-full bg-[var(--v2-accent)]" />
                )}
              </Link>

              <button
                type="button"
                onClick={() => setInstagramMenuOpen((current) => !current)}
                aria-expanded={instagramMenuOpen}
                aria-haspopup="menu"
                aria-label="Open Instagram downloader menu"
                className={[
                  "relative flex h-8 w-8 items-center justify-center rounded-r-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]",
                  instagramActive
                    ? "text-[var(--v2-text)]"
                    : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
                ].join(" ")}
              >
                <ChevronIcon open={instagramMenuOpen} />
              </button>

              {instagramMenuOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[42px] z-50 w-56 overflow-hidden rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-1.5 shadow-[var(--v2-shadow)]"
                >
                  <Link
                    href="/v2-preview/instagram-downloader"
                    role="menuitem"
                    className="block rounded-xl px-3 py-2.5 text-xs font-black transition hover:bg-[var(--v2-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
                  >
                    Instagram Downloader
                    <span className="mt-0.5 block text-[10px] font-medium text-[var(--v2-muted)]">
                      Auto-detect the post type
                    </span>
                  </Link>
                  <div className="my-1 h-px bg-[var(--v2-border)]" />
                  {instagramTools.map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-[var(--v2-muted)] transition hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex shrink-0 items-center">
              <Link
                href="/v2-preview/x-downloader"
                className={[
                  "relative rounded-l-lg py-2 pl-3 pr-2 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm",
                  xActive
                    ? "text-[var(--v2-text)]"
                    : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
                ].join(" ")}
              >
                X / Twitter
                {xActive && (
                  <span className="absolute left-3 right-0 -bottom-[7px] h-0.5 rounded-full bg-[var(--v2-accent)]" />
                )}
              </Link>
              <button
                type="button"
                onClick={() => setXMenuOpen((current) => !current)}
                aria-expanded={xMenuOpen}
                aria-haspopup="menu"
                aria-label="Open X downloader menu"
                className="flex h-8 w-8 items-center justify-center rounded-r-lg text-[var(--v2-muted)] transition hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
              >
                <ChevronIcon open={xMenuOpen} />
              </button>
              {xMenuOpen && (
                <div
                  role="menu"
                  className="fixed left-1/2 top-[116px] z-50 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-1.5 shadow-[var(--v2-shadow)] sm:absolute sm:left-0 sm:top-[42px] sm:translate-x-0"
                >
                  <Link
                    href="/v2-preview/x-downloader"
                    className="block rounded-xl px-3 py-2.5 text-xs font-black hover:bg-[var(--v2-surface-2)]"
                  >
                    X / Twitter Downloader
                  </Link>
                  <div className="my-1 h-px bg-[var(--v2-border)]" />
                  {xTools.map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex shrink-0 items-center">
              <Link
                href="/v2-preview/pinterest-downloader"
                className={[
                  "relative rounded-l-lg py-2 pl-3 pr-2 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm",
                  pinterestActive
                    ? "text-[var(--v2-text)]"
                    : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
                ].join(" ")}
              >
                Pinterest
                {pinterestActive && (
                  <span className="absolute left-3 right-0 -bottom-[7px] h-0.5 rounded-full bg-[var(--v2-accent)]" />
                )}
              </Link>
              <button
                type="button"
                onClick={() => setPinterestMenuOpen((current) => !current)}
                aria-expanded={pinterestMenuOpen}
                aria-haspopup="menu"
                aria-label="Open Pinterest downloader menu"
                className="flex h-8 w-8 items-center justify-center rounded-r-lg text-[var(--v2-muted)] transition hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
              >
                <ChevronIcon open={pinterestMenuOpen} />
              </button>
              {pinterestMenuOpen && (
                <div
                  role="menu"
                  className="fixed left-1/2 top-[116px] z-50 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-1.5 shadow-[var(--v2-shadow)] sm:absolute sm:left-0 sm:top-[42px] sm:translate-x-0"
                >
                  <Link
                    href="/v2-preview/pinterest-downloader"
                    className="block rounded-xl px-3 py-2.5 text-xs font-black hover:bg-[var(--v2-surface-2)]"
                  >
                    Pinterest Downloader
                  </Link>
                  <div className="my-1 h-px bg-[var(--v2-border)]" />
                  {pinterestTools.map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex shrink-0 items-center">
              <Link
                href="/v2-preview/reddit-downloader"
                className={[
                  "relative rounded-l-lg py-2 pl-3 pr-2 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] sm:text-sm",
                  redditActive
                    ? "text-[var(--v2-text)]"
                    : "text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]",
                ].join(" ")}
              >
                Reddit
                {redditActive && (
                  <span className="absolute left-3 right-0 -bottom-[7px] h-0.5 rounded-full bg-[var(--v2-accent)]" />
                )}
              </Link>
              <button
                type="button"
                onClick={() => setRedditMenuOpen((current) => !current)}
                aria-expanded={redditMenuOpen}
                aria-haspopup="menu"
                aria-label="Open Reddit downloader menu"
                className="flex h-8 w-8 items-center justify-center rounded-r-lg text-[var(--v2-muted)] transition hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
              >
                <ChevronIcon open={redditMenuOpen} />
              </button>
              {redditMenuOpen && (
                <div
                  role="menu"
                  className="fixed left-1/2 top-[116px] z-50 w-60 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-1.5 shadow-[var(--v2-shadow)] sm:absolute sm:left-auto sm:right-0 sm:top-[42px] sm:translate-x-0"
                >
                  <Link
                    href="/v2-preview/reddit-downloader"
                    className="block rounded-xl px-3 py-2.5 text-xs font-black hover:bg-[var(--v2-surface-2)]"
                  >
                    Reddit Downloader
                  </Link>
                  <div className="my-1 h-px bg-[var(--v2-border)]" />
                  {redditTools.map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-xl px-3 py-2 text-xs font-bold text-[var(--v2-muted)] hover:bg-[var(--v2-surface-2)] hover:text-[var(--v2-text)]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 border-t border-[var(--v2-border)] bg-[var(--v2-surface)]/45">
        <div className="mx-auto grid w-full max-w-6xl gap-7 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] lg:px-8">
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
              Instagram
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-xs font-bold text-[var(--v2-muted)]">
              <Link href="/v2-preview/instagram-downloader">All Instagram</Link>
              <Link href="/v2-preview/instagram-reels-downloader">Reels</Link>
              <Link href="/v2-preview/instagram-video-downloader">Videos</Link>
              <Link href="/v2-preview/instagram-photo-downloader">Photos</Link>
              <Link href="/v2-preview/instagram-carousel-downloader">Carousels</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              X / Twitter
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-[var(--v2-muted)]">
              <Link href="/v2-preview/x-downloader">X Downloader</Link>
              <Link href="/v2-preview/twitter-video-downloader">Videos</Link>
              <Link href="/v2-preview/twitter-gif-downloader">GIFs</Link>
              <Link href="/v2-preview/twitter-image-downloader">Images</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              Pinterest
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-[var(--v2-muted)]">
              <Link href="/v2-preview/pinterest-downloader">Pinterest Downloader</Link>
              <Link href="/v2-preview/pinterest-video-downloader">Videos</Link>
              <Link href="/v2-preview/pinterest-image-downloader">Images</Link>
              <Link href="/v2-preview/pinterest-gif-downloader">GIFs</Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              Reddit
            </p>
            <div className="mt-3 grid gap-2 text-xs font-bold text-[var(--v2-muted)]">
              <Link href="/v2-preview/reddit-downloader">Reddit Downloader</Link>
              <Link href="/v2-preview/reddit-video-downloader">Videos</Link>
              <Link href="/v2-preview/reddit-gif-downloader">GIFs</Link>
              <Link href="/v2-preview/reddit-image-downloader">Images & galleries</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--v2-border)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-[10px] text-[var(--v2-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>Public links only.</span>
            <span>Not affiliated with Instagram, Meta, X, Twitter, Pinterest, or Reddit.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={["h-3.5 w-3.5 transition-transform", open ? "rotate-180" : ""].join(" ")}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5.5 7.5 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
