import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaveMingo",
    short_name: "SaveMingo",
    description: "Save anything you find online. Save it. Keep it.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf9",
    theme_color: "#fffdf9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
