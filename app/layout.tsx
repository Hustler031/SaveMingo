import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://savemingo.com"),
  title: {
    default: "SaveMingo — Save anything you find online",
    template: "%s | SaveMingo",
  },
  description:
    "SaveMingo is a clean, fast downloader for public social media content. Save it. Keep it.",
  applicationName: "SaveMingo",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://savemingo.com",
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
      <body>{children}</body>
    </html>
  );
}
