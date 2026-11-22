import type { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { getPosts, getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Blog: Wildkräuter-Wissen, Rezepte & Tipps",
  description: "Kräuterporträts, Wildkräuter-Rezepte und Tipps zum sicheren Sammeln – der Blog von Verkräutert.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/feed.xml" } },
};

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  return <BlogList settings={settings} posts={posts} />;
}
