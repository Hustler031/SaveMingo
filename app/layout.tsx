import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SaveMingo — Save anything you find online",
    template: "%s | SaveMingo",
  },
  description:
    "SaveMingo is a clean, fast downloader for supported public social media content. Save it. Keep it.",
  applicationName: "SaveMingo",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "SaveMingo",
    title: "SaveMingo — Save anything you find online",
    description: "Save it. Keep it.",
  },
};

export const viewport: Viewport = {
  themeColor: "#fffdf9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
