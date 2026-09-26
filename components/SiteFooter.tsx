import Link from "next/link";
import { Brand } from "@/components/Brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white/35">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <Brand compact />
          <span className="hidden h-5 w-px bg-neutral-200 sm:block" />
          <p className="text-sm text-neutral-500">Save it. Keep it.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-neutral-500">
          <Link className="transition hover:text-neutral-950" href="/">
            Home
          </Link>
          <Link
            className="transition hover:text-neutral-950"
            href="/instagram-downloader"
          >
            Instagram Downloader
          </Link>
          <span>Public links only</span>
        </div>
      </div>
    </footer>
  );
}
