"use client";

import { FormEvent, useMemo, useState } from "react";
import { ResultCard } from "@/components/downloader/ResultCard";
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

type DownloaderProps = {
  compact?: boolean;
};

function createClientRequestId() {
  const raw =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "")
      : Math.random().toString(36).slice(2);

  return `sm_ui_${raw.slice(0, 10).toUpperCase()}`;
}

export function Downloader({ compact = false }: DownloaderProps) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<DownloaderState>({ phase: "idle" });

  const isBusy = state.phase === "validating" || state.phase === "resolving";
  const canSubmit = useMemo(
    () => url.trim().length > 0 && !isBusy,
    [url, isBusy],
  );

  function resetFeedback() {
    if (state.phase !== "idle") {
      setState({ phase: "idle" });
    }
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
    await new Promise((resolve) => window.setTimeout(resolve, 160));

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
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={submit}
        className={[
          "border border-[var(--border)] bg-white/92 shadow-[var(--shadow)] backdrop-blur",
          compact
            ? "rounded-[26px] p-2.5 sm:p-3"
            : "rounded-[30px] p-3 sm:p-3.5",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="media-url" className="sr-only">
            Instagram link
          </label>

          <div className="flex min-w-0 flex-1 items-center rounded-[21px] bg-neutral-50 px-4 ring-1 ring-inset ring-neutral-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--accent)]">
            <span
              aria-hidden="true"
              className="mr-2 hidden text-base text-neutral-400 sm:inline"
            >
              ↗
            </span>
            <input
              id="media-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                resetFeedback();
              }}
              placeholder="Paste an Instagram link..."
              className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="ml-2 rounded-xl px-3 py-2 text-sm font-extrabold text-[var(--accent-strong)] transition hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Paste
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-14 min-w-32 items-center justify-center gap-2 rounded-[20px] bg-neutral-950 px-6 text-sm font-black text-white shadow-lg shadow-neutral-950/10 transition hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
          >
            {state.phase === "validating" || state.phase === "resolving" ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                />
                {state.phase === "validating" ? "Checking" : "Finding media"}
              </>
            ) : (
              "Get media"
            )}
          </button>
        </div>
      </form>

      <div className="mt-3 min-h-24" aria-live="polite">
        {state.phase === "idle" && <IdleStatus compact={compact} />}

        {state.phase === "validating" && (
          <LoadingStatus text="Checking the link format…" />
        )}

        {state.phase === "resolving" && (
          <LoadingStatus text="Finding public media…" />
        )}

        {state.phase === "error" && state.error && (
          <ErrorStatus error={state.error} />
        )}

        {state.phase === "success" && state.result && (
          <ResultCard result={state.result} />
        )}
      </div>
    </div>
  );
}

function IdleStatus({ compact }: { compact: boolean }) {
  return (
    <div
      className={[
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-3 text-xs font-bold text-neutral-500",
        compact ? "pt-1" : "pt-2",
      ].join(" ")}
    >
      <span>✓ No signup</span>
      <span>✓ Public links</span>
      <span>✓ Mobile friendly</span>
    </div>
  );
}

function LoadingStatus({ text }: { text: string }) {
  return (
    <div className="mx-auto flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white/70 px-4 py-4 text-sm text-neutral-600">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--accent)]" />
      {text}
    </div>
  );
}

function ErrorStatus({ error }: { error: DownloaderUiError }) {
  return (
    <div className="mx-auto max-w-xl rounded-[22px] border border-red-200 bg-red-50/80 px-5 py-4 text-left shadow-sm">
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white"
        >
          !
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-red-950">
            We couldn’t get that media
          </p>
          <p className="mt-1 text-sm leading-6 text-red-800">{error.message}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-red-700/80">
            <span>{error.code}</span>
            <span className="break-all">{error.requestId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
