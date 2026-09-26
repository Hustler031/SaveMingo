import type { MetadataRoute } from "next";
import { primaryRoutes, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return primaryRoutes.map((path) => ({
    url: SITE_URL + path,
    lastModified: now,
    changeFrequency:
      path === "/" || path.includes("downloader") ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/instagram-downloader"
          ? 0.95
          : path.includes("downloader")
            ? 0.9
            : 0.6,
  }));
}
