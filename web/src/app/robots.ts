import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Alles erlaubt (die alte Wix-Seite war mit «noindex» für Google gesperrt); auch im Wartungsmodus lesbar
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/warenkorb" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
