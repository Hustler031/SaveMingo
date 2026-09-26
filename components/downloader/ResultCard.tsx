import type { ResolveSuccess } from "@/lib/downloader/types";

type ResultCardProps = {
  result: ResolveSuccess;
};

export function ResultCard({ result }: ResultCardProps) {
  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <p className="text-xs font-black tracking-[0.12em] text-[var(--accent-strong)] uppercase">
            Media found
          </p>
          <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-neutral-950">
            {result.media.length}{" "}
            {result.media.length === 1 ? "item" : "items"} ready
          </h2>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-600">
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
              <div>
                <p className="text-sm font-black text-neutral-950">
                  {item.type === "video" ? "Video" : "Photo"} {index + 1}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {[item.quality, item.width && item.height
                    ? `${item.width}×${item.height}`
                    : null]
                    .filter(Boolean)
                    .join(" · ") || "Available media"}
                </p>
              </div>
              <a
                href={item.url}
                className="rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-neutral-800"
              >
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 font-mono text-[11px] text-neutral-400">
        Request {result.requestId}
      </p>
    </section>
  );
}
