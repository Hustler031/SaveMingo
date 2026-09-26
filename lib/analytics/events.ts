"use client";

export type AnalyticsEventName =
  | "paste_clicked"
  | "resolve_started"
  | "resolve_success"
  | "resolve_failed"
  | "download_clicked";

export type AnalyticsEventParams = {
  content_type?: string;
  error_code?: string;
  media_count?: number;
  landing_page?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  params: AnalyticsEventParams = {},
) {
  if (typeof window === "undefined") return;

  const payload = {
    ...params,
    landing_page: params.landing_page ?? window.location.pathname,
  };

  window.dispatchEvent(
    new CustomEvent("savemingo:analytics", {
      detail: { name, ...payload },
    }),
  );

  window.gtag?.("event", name, payload);
}
