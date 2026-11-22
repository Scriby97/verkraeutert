import type { MetadataRoute } from "next";
import { postCategories } from "@/lib/blog";
import { getPages, getPosts, getProducts, getSettings } from "@/lib/sanity";
import { siteUrl } from "@/lib/site";

// Statischer Export: wird beim Build als out/sitemap.xml erzeugt (die alte Wix-Seite hatte keine)
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products, posts, settings] = await Promise.all([getPages(), getProducts(), getPosts(), getSettings()]);
  const newest = posts[0]?.publishedAt;
  const fixed = ["", "/kurse", "/ueber-uns", "/kontakt", "/impressum", "/datenschutz", ...(settings.agbText ? ["/agb"] : [])];
  return [
    ...fixed.map((path) => ({ url: `${siteUrl}${path}` })),
    { url: `${siteUrl}/blog`, ...(newest && { lastModified: newest }) },
    ...postCategories.map((c) => ({ url: `${siteUrl}/blog/kategorie/${c.value}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.publishedAt })),
    ...pages.map((p) => ({ url: `${siteUrl}/${p.slug}` })),
    ...products.map((p) => ({ url: `${siteUrl}/kurse/${p.slug}` })),
  ];
}
