import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Switchboard",
    short_name: "Switchboard",
    description: "Every project in one place, three live at a time, one next step each.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f3f6",
    theme_color: "#0e1218",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
