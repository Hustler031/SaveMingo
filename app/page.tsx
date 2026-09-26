import { Brand } from "@/components/Brand";
import { DownloaderShell } from "@/components/DownloaderShell";

const capabilities = [
  ["Reels", "Save public Instagram Reels in the available media quality."],
  ["Videos", "A clean flow for public Instagram video posts."],
  ["Photos", "Keep public photos without unnecessary accounts or clutter."],
  ["Carousels", "Handle multi-item posts through one simple link."],
];

const steps = [
  ["01", "Copy", "Copy the link of the public Instagram post you want to save."],
  ["02", "Paste", "Paste it into SaveMingo. We validate the link before processing."],
  ["03", "Save", "Choose the available media result and save it to your device."],
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <div className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1.5 text-xs font-bold text-neutral-600 shadow-sm">
          V1 · Instagram first
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/75 px-4 py-2 text-xs font-extrabold tracking-[0.08em] text-pink-700 uppercase shadow-sm">
          Clean downloads. No clutter.
        </div>

        <h1 className="max-w-4xl text-balance text-5xl font-black tracking-[-0.055em] text-neutral-950 sm:text-7xl">
          Save anything you
          <span className="block text-[var(--accent-strong)]">find online.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-neutral-600 sm:text-lg">
          SaveMingo is being built as a fast, simple way to save public social
          media content. Instagram comes first.
        </p>

        <div className="mt-10 w-full">
          <DownloaderShell />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-neutral-500">
          <span>✓ No signup</span>
          <span>✓ Mobile first</span>
          <span>✓ Clear error states</span>
          <span>✓ Public links only</span>
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/55">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {capabilities.map(([title, text]) => (
            <article
              key={title}
              className="rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg">
                ↘
              </div>
              <h2 className="text-lg font-black tracking-[-0.03em] text-neutral-950">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black tracking-[0.15em] text-[var(--accent-strong)] uppercase">
              Three steps
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-neutral-950">
              Save it. Keep it.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">
              The product stays deliberately simple: one link in, a clear media
              result out. Everything behind it is structured for reliable debugging.
            </p>
          </div>

          <div className="grid gap-3">
            {steps.map(([number, title, text]) => (
              <div
                key={number}
                className="grid grid-cols-[3rem_1fr] gap-4 rounded-[24px] border border-neutral-200 bg-white/80 p-5"
              >
                <div className="text-sm font-black text-neutral-400">{number}</div>
                <div>
                  <h3 className="font-black text-neutral-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Brand compact />
          <p>Save anything you find online. · Save it. Keep it.</p>
        </div>
      </footer>
    </main>
  );
}
