import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogList } from "@/components/BlogList";
import { categoryLabel, postCategories } from "@/lib/blog";
import { getPosts, getSettings } from "@/lib/sanity";

export const dynamicParams = false;

export function generateStaticParams() {
  return postCategories.map((c) => ({ category: c.value }));
}

export async function generateMetadata({ params }: PageProps<"/blog/kategorie/[category]">): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${categoryLabel(category)} – Blog`,
    description: `Blogartikel über Wildkräuter in der Kategorie «${categoryLabel(category)}» – von Jenny und Bettina, Verkräutert.`,
    alternates: { canonical: `/blog/kategorie/${category}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/blog/kategorie/[category]">) {
  const { category } = await params;
  if (!postCategories.some((c) => c.value === category)) notFound();
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  return <BlogList settings={settings} posts={posts.filter((p) => p.category === category)} category={category} />;
}
