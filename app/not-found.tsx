import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-5 text-center sm:px-8">
        <p className="text-xs font-black tracking-[0.16em] text-[var(--accent-strong)] uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-neutral-950">
          This page wandered off.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
          The link may be outdated. Head back to SaveMingo or open the Instagram
          downloader.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-black text-white"
          >
            Home
          </Link>
          <Link
            href="/instagram-downloader"
            className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-black text-neutral-800"
          >
            Instagram Downloader
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
