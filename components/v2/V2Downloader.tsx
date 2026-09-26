"use client";

import { FormEvent, useMemo, useState } from "react";
import { V2ResultCard } from "@/components/v2/V2ResultCard";
import { trackEvent } from "@/lib/analytics/events";
import type {
  DownloaderPhase,
  DownloaderUiError,
  ResolveResponse,
  ResolveSuccess,
} from "@/lib/downloader/types";
import { validateInstagramUrl } from "@/lib/downloader/validation";

type DownloaderState = {
  phase: DownloaderPhase;
  error?: DownloaderUiError;
  result?: ResolveSuccess;
};

function createClientRequestId() {
  const raw =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "")
      : Math.random().toString(36).slice(2);

  return "sm_ui_" + raw.slice(0, 10).toUpperCase();
}

export function V2Downloader() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<DownloaderState>({ phase: "idle" });

  const isBusy = state.phase === "validating" || state.phase === "resolving";
  const canSubmit = useMemo(
    () => url.trim().length > 0 && !isBusy,
    [url, isBusy],
  );

  function resetFeedback() {
    if (state.phase !== "idle") setState({ phase: "idle" });
  }

  async function pasteFromClipboard() {
    trackEvent("paste_clicked");

    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
      setState({ phase: "idle" });
    } catch {
      const error = {
        code: "SM-UI-401" as const,
        message:
          "Clipboard access was blocked. Paste the Instagram link manually.",
        requestId: createClientRequestId(),
      };

      trackEvent("resolve_failed", { error_code: error.code });
      setState({ phase: "error", error });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ phase: "validating" });

    await new Promise((resolve) => window.setTimeout(resolve, 120));

    const validated = validateInstagramUrl(url);

    if (!validated.ok) {
      trackEvent("resolve_failed", { error_code: validated.code });
      setState({
        phase: "error",
        error: {
          code: validated.code,
          message: validated.message,
          requestId: createClientRequestId(),
        },
      });
      return;
    }

    trackEvent("resolve_started", {
      content_type: validated.contentType,
    });

    setUrl(validated.normalizedUrl);
    setState({ phase: "resolving" });

    try {
      const response = await fetch("/api/v1/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: validated.normalizedUrl,
        }),
      });

      const payload = (await response.json()) as ResolveResponse;

      if (!payload.success) {
        trackEvent("resolve_failed", {
          error_code: payload.error.code,
          content_type: validated.contentType,
        });

        setState({
          phase: "error",
          error: {
            code: payload.error.code,
            message: payload.error.message,
            requestId: payload.requestId,
          },
        });
        return;
      }

      trackEvent("resolve_success", {
        content_type: payload.contentType,
        media_count: payload.media.length,
      });

      setState({
        phase: "success",
        result: payload,
      });
    } catch {
      trackEvent("resolve_failed", { error_code: "SM-SRV-301" });

      setState({
        phase: "error",
        error: {
          code: "SM-SRV-301",
          message:
            "SaveMingo couldn’t reach the resolver. Try the link again shortly.",
          requestId: createClientRequestId(),
        },
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <form
        onSubmit={submit}
        className="rounded-[24px] border border-[var(--v2-border)] bg-[var(--v2-surface)] p-2.5 shadow-[var(--v2-shadow)] sm:p-3"
      >
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <label htmlFor="v2-media-url" className="sr-only">
            Instagram link
          </label>

          <div className="flex min-w-0 flex-1 items-center rounded-[17px] border border-[var(--v2-border)] bg-[var(--v2-surface-2)] px-3.5 transition focus-within:border-[var(--v2-accent)] focus-within:ring-2 focus-within:ring-[var(--v2-accent)]/15">
            <LinkIcon />
            <input
              id="v2-media-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                resetFeedback();
              }}
              placeholder="Paste an Instagram link"
              className="h-14 min-w-0 flex-1 bg-transparent px-2.5 text-[15px] font-medium text-[var(--v2-text)] outline-none placeholder:text-[var(--v2-muted)]"
            />
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-black text-[var(--v2-accent-strong)] transition hover:bg-[var(--v2-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
            >
              Paste
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-14 items-center justify-center gap-2 rounded-[17px] bg-[var(--v2-accent)] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-bg)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:min-w-40"
          >
            {isBusy ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                />
                {state.phase === "validating" ? "Checking" : "Finding media"}
              </>
            ) : (
              <>
                <DownloadIcon />
                Download
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 min-h-16" aria-live="polite">
        {state.phase === "validating" && (
          <LoadingStatus
            title="Checking your link"
            text="Making sure this is a supported public Instagram URL."
          />
        )}

        {state.phase === "resolving" && (
          <LoadingStatus
            title="Finding your media"
            text="Resolving the public media and preparing the preview."
          />
        )}

        {state.phase === "error" && state.error && (
          <ErrorStatus error={state.error} onReset={() => setState({ phase: "idle" })} />
        )}

        {state.phase === "success" && state.result && (
          <V2ResultCard key={state.result.requestId} result={state.result} />
        )}
      </div>
    </div>
  );
}

function LoadingStatus({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-4 text-left">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 rounded-xl bg-[var(--v2-accent-soft)]">
          <span className="absolute inset-0 m-auto h-3 w-3 animate-pulse rounded-full bg-[var(--v2-accent)]" />
        </div>
        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-[var(--v2-muted)]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorStatus({
  error,
  onReset,
}: {
  error: DownloaderUiError;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-left">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500 text-sm font-black text-white">
          !
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">We couldn’t get that media</p>
          <p className="mt-1 text-sm leading-6 text-[var(--v2-muted)]">
            {error.message}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-[var(--v2-muted)]">
            <span>{error.code}</span>
            <span className="break-all">{error.requestId}</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 rounded-xl border border-[var(--v2-border)] bg-[var(--v2-surface)] px-3 py-2 text-xs font-black transition hover:border-[var(--v2-accent)]"
          >
            Try another link
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0 text-[var(--v2-muted)]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9.5 14.5 5-5M7.8 17.6l-1.4 1.3a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0M16.2 6.4l1.4-1.3a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M10 3v9m0 0 3.4-3.4M10 12 6.6 8.6M4 15.5h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
