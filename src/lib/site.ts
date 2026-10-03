/**
 * Name, copy and URL used by metadata, the manifest, the share image,
 * robots.txt and the sitemap.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production URL. On Vercel the production
 * domain is picked up automatically.
 */
export const SITE = {
  name: "Switchboard",
  tagline: "Every project in one place, three live at a time, one next step each.",
  description:
    "Switchboard is a personal project organizer for people running many projects at once. Track where each project stands, keep three live at a time, and always know the one next step.",
  keywords: [
    "project organizer",
    "personal project tracker",
    "side project manager",
    "next step",
    "focus",
    "productivity",
    "work in progress limit",
  ],
  url: siteUrl(),
};

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
