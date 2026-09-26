import Link from "next/link";
import { Brand } from "@/components/Brand";

const productLinks = [
  ["/instagram-downloader", "Instagram"],
  ["/instagram-reels-downloader", "Reels"],
  ["/instagram-video-downloader", "Videos"],
  ["/instagram-photo-downloader", "Photos"],
  ["/instagram-carousel-downloader", "Carousels"],
] as const;

const companyLinks = [
  ["/about", "About"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/copyright", "Copyright"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white/35">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Brand compact />
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
            Save anything you find online. Save it. Keep it.
          </p>
        </div>

        <div>
          <p className="text-xs font-black tracking-[0.12em] text-neutral-400 uppercase">
            Instagram tools
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:flex-col">
            {productLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-950"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black tracking-[0.12em] text-neutral-400 uppercase">
            SaveMingo
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:flex-col">
            {companyLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-semibold text-neutral-500 transition hover:text-neutral-950"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-[11px] text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Public links only.</span>
          <span>SaveMingo is not affiliated with Instagram or Meta.</span>
        </div>
      </div>
    </footer>
  );
}
