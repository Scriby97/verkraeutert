import { getPosts, getSettings } from "@/lib/sanity";
import { siteUrl } from "@/lib/site";

// RSS-Feed des Blogs (für Feed-Reader; ersetzt /blog-feed.xml der alten Wix-Seite)
export const dynamic = "force-static";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const name = settings.siteName ?? "Verkräutert";
  const items = posts
    .map(
      (p) => `<item>
  <title>${escape(p.title)}</title>
  <link>${siteUrl}/blog/${p.slug}</link>
  <guid>${siteUrl}/blog/${p.slug}</guid>
  <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
  ${p.author ? `<author>${escape(p.author)}</author>` : ""}
  <description>${escape(p.excerpt ?? "")}</description>
</item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escape(name)} – Blog</title>
  <link>${siteUrl}/blog</link>
  <description>${escape(settings.blogIntro ?? "Wildkräuter-Wissen, Rezepte und Tipps")}</description>
  <language>de-CH</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
