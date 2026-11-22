import type { Post, Product, SiteSettings } from "./sanity";
import { siteUrl } from "./site";

// Strukturierte Daten (schema.org als JSON-LD) für Google: unsichtbar im Quelltext. Damit kann Google Kurse mit
// Datum und Preis, Blogartikel mit Autorin und Datum sowie die Firma selbst richtig einordnen.

/** JSON für <script type="application/ld+json">; «<» maskiert, damit Texte aus dem Studio kein HTML einschleusen */
export function jsonLdScript(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationJsonLd(settings: SiteSettings, logo?: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName ?? "Verkräutert",
    url: siteUrl,
    ...(logo ? { logo } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    sameAs: [settings.instagram, settings.tiktok, settings.facebook].filter(Boolean),
  };
}

/** Kurs mit festen Daten → Event (erscheint bei Google mit Datum); andere Angebote → Product mit Preis */
export function productJsonLd(product: Product, images: string[], settings: SiteSettings) {
  const url = `${siteUrl}/kurse/${product.slug}`;
  const offer = {
    "@type": "Offer",
    url,
    price: (product.price ?? 0).toFixed(2),
    priceCurrency: "CHF",
    availability:
      !product.available || product.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
  };
  const organizer = { "@type": "Organization", name: settings.siteName ?? "Verkräutert", url: siteUrl };
  if (product.kind === "event" && product.date) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: product.name,
      ...(product.description ? { description: product.description } : {}),
      ...(images.length ? { image: images.slice(0, 3) } : {}),
      startDate: product.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: product.location ?? "Aargau",
        address: { "@type": "PostalAddress", addressLocality: product.location ?? "Aargau", addressCountry: "CH" },
      },
      organizer,
      offers: offer,
      url,
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length ? { image: images.slice(0, 5) } : {}),
    brand: { "@type": "Brand", name: settings.siteName ?? "Verkräutert" },
    offers: offer,
    url,
  };
}

export function postJsonLd(post: Post, image: string | null, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    ...(image ? { image } : {}),
    author: { "@type": "Person", name: post.author ?? "Verkräutert" },
    publisher: { "@type": "Organization", name: settings.siteName ?? "Verkräutert", url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    inLanguage: "de-CH",
  };
}
