"use client";

import Image from "next/image";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics/events";
import type { MediaAsset, ResolveSuccess } from "@/lib/downloader/types";

type Props = {
  result: ResolveSuccess;
};

function mediaName(
  platform: ResolveSuccess["platform"],
  contentType: ResolveSuccess["contentType"],
  index: number,
) {
  return [platform, contentType, String(index + 1).padStart(2, "0")].join("-");
}

function mediaHref(
  sourceUrl: string,
  platform: ResolveSuccess["platform"],
  contentType: ResolveSuccess["contentType"],
  index: number,
  inline = false,
) {
  const params = new URLSearchParams({
    src: sourceUrl,
    name: mediaName(platform, contentType, index),
  });

  if (inline) params.set("inline", "1");

  return "/api/v1/media?" + params.toString();
}

function platformLabel(platform: ResolveSuccess["platform"]) {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "x":
      return "X";
    case "pinterest":
      return "Pinterest";
    case "reddit":
      return "Reddit";
    case "tiktok":
      return "TikTok";
  }
}

function redditAudioStatus(item: MediaAsset, platform: ResolveSuccess["platform"]) {
  if (platform !== "reddit" || item.type !== "video" || !item.audioStatus) {
    return null;
  }

  switch (item.audioStatus) {
    case "included":
      return {
        label: "Sound included",
        detail: "This media source reports audio in the downloadable file.",
      };
    case "separate":
      return {
        label: "Sound detected in source",
        detail:
          "Reddit reports audio separately from the video track. Current SaveMingo download may be silent until audio merging is enabled.",
      };
    case "none":
      return {
        label: "No sound detected",
        detail: "Reddit reports no audio for this source.",
      };
    case "unknown":
      return {
        label: "Sound status unknown",
        detail: "Reddit did not provide a reliable audio flag for this source.",
      };
  }
}

export function V2ResultCard({ result }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const hasMultiple = result.media.length > 1;
  const selected = result.media[selectedIndex] ?? result.media[0];
  const audioStatus = selected
    ? redditAudioStatus(selected, result.platform)
    : null;

  function trackSingleDownload() {
    trackEvent("download_clicked", {
      content_type: result.contentType,
      media_count: result.media.length,
    });

    if (result.platform === "reddit" && selected?.type === "video") {
      if (selected.audioStatus === "none") {
        setDownloadNotice(
          "Download started. No sound was detected in this Reddit source.",
        );
      } else if (selected.audioStatus === "separate") {
        setDownloadNotice(
          "Download started. Reddit reports a separate audio stream, so this current video file may be silent.",
        );
      } else if (selected.audioStatus === "unknown") {
        setDownloadNotice(
          "Download started. Reddit did not provide a reliable sound status for this source.",
        );
      } else {
        setDownloadNotice(null);
      }
    }
  }

  function downloadAll() {
    trackEvent("download_clicked", {
      content_type: result.contentType,
      media_count: result.media.length,
    });

    result.media.forEach((item, index) => {
      window.setTimeout(() => {
        const anchor = document.createElement("a");
        anchor.href = mediaHref(item.url, result.platform, result.contentType, index);
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }, index * 420);
    });
  }

  function selectRelative(delta: number) {
    setSelectedIndex((current) => {
      const next = current + delta;
      if (next < 0) return result.media.length - 1;
      if (next >= result.media.length) return 0;
      return next;
    });
  }

  return (
    <section className="mx-auto max-w-2xl overflow-hidden rounded-[22px] border border-[var(--v2-border)] bg-[var(--v2-surface)] text-left shadow-[var(--v2-shadow)]">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Media ready
            </div>
            <h2 className="mt-1.5 text-xl font-black tracking-[-0.035em]">
              {result.media.length} {result.media.length === 1 ? "item" : "items"} ready
            </h2>
            <p className="mt-1 text-sm text-[var(--v2-muted)]">
              {hasMultiple
                ? "Download everything now, or open Preview to inspect individual items."
                : mediaDescription(selected)}
            </p>
          </div>

          <span className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-3 py-1.5 text-[10px] font-black capitalize text-[var(--v2-muted)]">
            {platformLabel(result.platform)} {result.contentType}
          </span>
        </div>

        {audioStatus && (
          <div className="mt-4 rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-4 py-3">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 text-base"
              >
                {selected.audioStatus === "none" ? "🔇" : "🔊"}
              </span>
              <div>
                <p className="text-xs font-black">{audioStatus.label}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--v2-muted)]">
                  {audioStatus.detail}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col items-center">
          {hasMultiple ? (
            <button
              type="button"
              onClick={downloadAll}
              className="flex h-12 w-full max-w-[240px] items-center justify-center gap-2 rounded-[15px] bg-[var(--v2-accent)] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
            >
              <StackIcon />
              Download all {result.media.length}
            </button>
          ) : (
            <a
              href={mediaHref(selected.url, result.platform, result.contentType, 0)}
              onClick={trackSingleDownload}
              className="flex h-12 w-full max-w-[240px] items-center justify-center gap-2 rounded-[15px] bg-[var(--v2-accent)] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
            >
              <DownloadIcon />
              Download {selected.type === "video" ? "video" : "photo"}
            </a>
          )}

          {downloadNotice && (
            <p className="mt-3 max-w-md text-center text-xs leading-5 text-[var(--v2-muted)]">
              {downloadNotice}
            </p>
          )}

          <button
            type="button"
            onClick={() => setPreviewOpen((current) => !current)}
            className="mt-2.5 flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-4 text-xs font-black text-[var(--v2-text)] transition hover:border-[var(--v2-accent)] hover:text-[var(--v2-accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
          >
            <EyeIcon />
            {previewOpen ? "Hide preview" : "Preview media"}
          </button>
        </div>
      </div>

      {previewOpen && (
        <div className="border-t border-[var(--v2-border)]">
          <div className="relative bg-black">
            <div className="relative mx-auto aspect-[4/5] max-h-[590px] w-full sm:aspect-[16/10]">
              <MediaPreview
                item={selected}
                href={mediaHref(
                  selected.url,
                  result.platform,
                  result.contentType,
                  selectedIndex,
                  true,
                )}
                alt={
                  platformLabel(result.platform) +
                  " " +
                  selected.type +
                  " preview " +
                  (selectedIndex + 1)
                }
              />

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={() => selectRelative(-1)}
                    aria-label="Previous carousel item"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRelative(1)}
                    aria-label="Next carousel item"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--v2-muted)]">
                  Preview
                </p>
                <h3 className="mt-1 text-lg font-black tracking-[-0.03em]">
                  {selected.type === "video" ? "Video" : "Photo"} {selectedIndex + 1}
                  {hasMultiple ? " of " + result.media.length : ""}
                </h3>
                <p className="mt-1 text-xs text-[var(--v2-muted)]">
                  {mediaDescription(selected)}
                </p>
              </div>

              {hasMultiple && (
                <a
                  href={mediaHref(selected.url, result.platform, result.contentType, selectedIndex)}
                  onClick={trackSingleDownload}
                  className="shrink-0 rounded-xl border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-3 py-2 text-xs font-black transition hover:border-[var(--v2-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
                >
                  Download item
                </a>
              )}
            </div>

            {hasMultiple && (
              <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-7">
                {result.media.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={"Preview item " + (index + 1)}
                    className={[
                      "relative aspect-square overflow-hidden rounded-xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]",
                      index === selectedIndex
                        ? "border-[var(--v2-accent)]"
                        : "border-transparent opacity-70 hover:opacity-100",
                    ].join(" ")}
                  >
                    <Thumbnail
                      item={item}
                      href={mediaHref(item.url, result.platform, result.contentType, index, true)}
                      number={index + 1}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 border-t border-[var(--v2-border)] pt-3 text-[10px] leading-4 text-[var(--v2-muted)]">
              <p>Media is streamed through SaveMingo without permanent storage.</p>
              <p className="mt-1 break-all font-mono">Request {result.requestId}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MediaPreview({
  item,
  href,
  alt,
}: {
  item: MediaAsset;
  href: string;
  alt: string;
}) {
  if (item.type === "video") {
    return (
      <video
        src={href}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={href}
      alt={alt}
      fill
      unoptimized
      sizes="(max-width: 768px) 100vw, 768px"
      className="object-contain"
    />
  );
}

function Thumbnail({
  item,
  href,
  number,
}: {
  item: MediaAsset;
  href: string;
  number: number;
}) {
  if (item.type === "image") {
    return (
      <>
        <Image
          src={href}
          alt=""
          fill
          unoptimized
          sizes="100px"
          className="object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-black text-white">
          {number}
        </span>
      </>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-black text-white">
      <PlayIcon />
      <span className="absolute bottom-1 right-1 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-black text-white">
        {number}
      </span>
    </div>
  );
}

function mediaDescription(item: MediaAsset) {
  return [
    item.quality || "Best available",
    item.width && item.height ? item.width + "×" + item.height : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={direction === "left" ? "h-4 w-4 rotate-180" : "h-4 w-4"}
      fill="none"
      aria-hidden="true"
    >
      <path d="m7 4 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M2.5 10s2.5-4.5 7.5-4.5 7.5 4.5 7.5 4.5-2.5 4.5-7.5 4.5S2.5 10 2.5 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M10 3v9m0 0 3.4-3.4M10 12 6.6 8.6M4 15.5h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 2h7a4 4 0 0 1 4 4v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M7 5.5v9l7-4.5-7-4.5Z" />
    </svg>
  );
}
