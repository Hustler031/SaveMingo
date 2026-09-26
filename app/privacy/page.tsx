import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description: "SaveMingo privacy information for the public-link downloader.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-black tracking-[-0.05em] text-neutral-950">
          Privacy
        </h1>
        <div className="mt-7 space-y-6 text-sm leading-7 text-neutral-600">
          <section>
            <h2 className="font-black text-neutral-950">Public links</h2>
            <p className="mt-1">
              SaveMingo processes URLs that you submit to resolve supported
              public media. Do not submit credentials, private links, or
              sensitive information.
            </p>
          </section>
          <section>
            <h2 className="font-black text-neutral-950">Operational logs</h2>
            <p className="mt-1">
              The service uses request IDs, error codes, timing data, status
              information, and limited technical diagnostics to keep the
              downloader working. The application is designed not to log
              Instagram passwords, authentication cookies, or complete signed
              media URLs.
            </p>
          </section>
          <section>
            <h2 className="font-black text-neutral-950">Media storage</h2>
            <p className="mt-1">
              The current media-delivery flow is designed to stream resolved
              media rather than intentionally keep a permanent copy on
              SaveMingo servers.
            </p>
          </section>
          <section>
            <h2 className="font-black text-neutral-950">Analytics</h2>
            <p className="mt-1">
              Analytics may be enabled to measure page visits and product
              events such as resolve attempts and download clicks. SaveMingo
              does not intentionally send the Instagram URL you paste as an
              analytics event parameter.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
