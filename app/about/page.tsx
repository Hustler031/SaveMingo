import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how SaveMingo is built around a simple public-link downloader workflow, clear diagnostics, and a lightweight architecture.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <p className="text-xs font-black tracking-[0.14em] text-[var(--accent-strong)] uppercase">
          About SaveMingo
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-neutral-950 sm:text-5xl">
          Save anything you find online.
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-neutral-600">
          <p>
            SaveMingo is a lightweight downloader project built around one
            simple idea: paste a supported public link, resolve the available
            media, and save it without unnecessary clutter.
          </p>
          <p>
            Instagram is the first platform. The application separates its
            interface, API, resolver, media delivery, monitoring, and error
            system so new platforms can be added without rebuilding the whole
            product.
          </p>
          <p>
            SaveMingo does not ask for Instagram credentials and is not designed
            to bypass private-account controls. The current product focuses on
            publicly accessible links.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
