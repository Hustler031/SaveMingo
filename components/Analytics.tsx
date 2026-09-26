"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_GA_ID = "G-ZXK1PRVH6X";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    if (!document.querySelector(`script[data-savemingo-ga="${GA_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.dataset.savemingoGa = GA_ID;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: false });
    }
  }, []);

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
