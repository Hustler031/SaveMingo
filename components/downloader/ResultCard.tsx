"use client";

import { trackEvent } from "@/lib/analytics/events";
import type { ResolveSuccess } from "@/lib/downloader/types";

type ResultCardProps = {
  result: ResolveSuccess;
};

function downloadHref(
  sourceUrl: string,
  contentType: ResolveSuccess["contentType"],
  index: number,
) {
  const name = [
    "instagram",
    contentType,
    String(index + 1).padStart(2, "0"),
  ].join("-");

  const params = new URLSearchParams({
    src: sourceUrl,
    name,
  });

  return "/api/v1/media?" + params.toString();
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white p-5 text-left shadow-[var(--shadow)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-xs font-black tracking-[0.12em] text-[var(--accent-strong)] uppercase">
            Media found
          </p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-neutral-950">
            {result.media.length} {result.media.length === 1 ? "item" : "items"} ready
          </h2>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold capitalize text-neutral-600">
          {result.contentType}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {result.media.map((item, index) => (
          <article
            key={item.id}
            className="rounded-[22px] border border-neutral-200 bg-neutral-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-neutral-950">
                  {item.type === "video" ? "Video" : "Photo"} {index + 1}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {[
                    item.quality,
                    item.width && item.height
                      ? `${item.width}×${item.height}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Available media"}
                </p>
              </div>

              <a
                href={downloadHref(item.url, result.contentType, index)}
                onClick={() =>
                  trackEvent("download_clicked", {
                    content_type: result.contentType,
                    media_count: result.media.length,
                  })
                }
                className="shrink-0 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
              >
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-1 text-[11px] text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Media is streamed through SaveMingo without permanent storage.</p>
        <p className="font-mono">Request {result.requestId}</p>
      </div>
    </section>
  );
}
