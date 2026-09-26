import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using SaveMingo's public-link downloader.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <h1 className="text-4xl font-black tracking-[-0.05em] text-neutral-950">
          Terms
        </h1>
        <div className="mt-7 space-y-6 text-sm leading-7 text-neutral-600">
          <p>
            SaveMingo is provided as a utility for supported publicly accessible
            links. You are responsible for using the service lawfully and for
            respecting applicable copyright, privacy, contractual, and platform
            rules.
          </p>
          <p>
            Do not use SaveMingo to bypass private-account controls, access
            content you are not authorized to access, or submit passwords,
            session cookies, or other authentication material.
          </p>
          <p>
            Availability is not guaranteed. Upstream platforms can change their
            public interfaces, restrict requests, remove posts, or expire media
            URLs at any time.
          </p>
          <p>
            SaveMingo may limit requests, disable abusive traffic, or change
            supported features to protect the service and its users.
          </p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
