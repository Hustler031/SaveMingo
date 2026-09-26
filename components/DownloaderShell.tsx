"use client";

import { FormEvent, useMemo, useState } from "react";

type Notice =
  | { kind: "idle"; text: string }
  | { kind: "success"; text: string }
  | { kind: "error"; text: string };

function isInstagramUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return host === "instagram.com" || host === "instagr.am";
  } catch {
    return false;
  }
}

export function DownloaderShell() {
  const [url, setUrl] = useState("");
  const [notice, setNotice] = useState<Notice>({
    kind: "idle",
    text: "Public Instagram links will be supported first.",
  });

  const canSubmit = useMemo(() => url.trim().length > 0, [url]);

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
      setNotice({
        kind: "idle",
        text: "Link pasted. We’ll validate it before sending anything.",
      });
    } catch {
      setNotice({
        kind: "error",
        text: "Clipboard access was blocked. Paste the link manually.",
      });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = url.trim();

    if (!isInstagramUrl(value)) {
      setNotice({
        kind: "error",
        text: "That doesn’t look like a valid Instagram link.",
      });
      return;
    }

    setNotice({
      kind: "success",
      text: "Instagram link detected. The resolver is the next V1 milestone.",
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={submit}
        className="rounded-[30px] border border-[var(--border)] bg-white/90 p-3 shadow-[var(--shadow)] backdrop-blur"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="media-url" className="sr-only">
            Instagram URL
          </label>
          <div className="flex min-w-0 flex-1 items-center rounded-[22px] bg-neutral-50 px-4 ring-1 ring-inset ring-neutral-200 focus-within:ring-2 focus-within:ring-[var(--accent)]">
            <input
              id="media-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                if (notice.kind !== "idle") {
                  setNotice({
                    kind: "idle",
                    text: "Public Instagram links will be supported first.",
                  });
                }
              }}
              placeholder="Paste an Instagram link..."
              className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="ml-2 rounded-xl px-3 py-2 text-sm font-bold text-[var(--accent-strong)] transition hover:bg-[var(--accent-soft)]"
            >
              Paste
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="h-14 rounded-[20px] bg-neutral-950 px-7 text-sm font-black text-white shadow-lg shadow-neutral-950/10 transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
          >
            Check link
          </button>
        </div>
      </form>

      <div
        aria-live="polite"
        className={[
          "mx-auto mt-3 min-h-6 px-3 text-center text-sm",
          notice.kind === "error"
            ? "text-red-600"
            : notice.kind === "success"
              ? "text-emerald-700"
              : "text-neutral-500",
        ].join(" ")}
      >
        {notice.text}
      </div>
    </div>
  );
}
