import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { Switchboard } from "@/components/Switchboard";
import { SITE } from "@/lib/site";

/** Structured data so search engines can describe the app in results. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* The tab comes from the URL, which is only known in the browser. */}
      <Suspense fallback={<PageShell />}>
        <Switchboard />
      </Suspense>
    </>
  );
}
