import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
      <Link
        href="/"
        aria-label="SaveMingo home"
        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4"
      >
        <Brand />
      </Link>

      <nav
        aria-label="Primary navigation"
        className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/75 p-1 shadow-sm backdrop-blur"
      >
        <Link
          href="/instagram-downloader"
          className="rounded-full px-3 py-2 text-xs font-extrabold text-neutral-700 transition hover:bg-neutral-100 sm:px-4 sm:text-sm"
        >
          Instagram
        </Link>
        <span className="hidden rounded-full bg-neutral-950 px-3 py-2 text-xs font-extrabold text-white sm:inline-flex">
          V1
        </span>
      </nav>
    </header>
  );
}
