import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/Blocks";
import { PostBody } from "@/components/PostBody";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { SanityImage } from "@/components/SanityImage";
import { categoryLabel, formatPostDate, readingMinutes } from "@/lib/blog";
import { getPosts, getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { jsonLdScript, postJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

async function findPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === decodeURIComponent(slug));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await findPost((await params).slug);
  if (!post) return {};
  const image = imageUrl(post.coverImage, { width: 1200, height: 630 });
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: post.coverImage?.alt ?? post.title }] }),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const [post, posts, products, settings] = await Promise.all([findPost((await params).slug), getPosts(), getProducts(), getSettings()]);
  if (!post) notFound();

  // Am Schluss: die gewählten Kurse, sonst die nächsten buchbaren Kurse
  const orderable = products.filter((p) => p.available && !p.soldOut);
  const chosen = post.relatedCourses.flatMap((slug) => orderable.filter((p) => p.slug === slug));
  const courses = (chosen.length ? chosen : orderable.filter((p) => p.kind === "event")).slice(0, 2);
  const more = posts.filter((p) => p._id !== post._id && p.category === post.category).concat(posts.filter((p) => p._id !== post._id && p.category !== post.category)).slice(0, 3);
  const jsonLd = postJsonLd(post, imageUrl(post.coverImage, { width: 1200, height: 675 }), settings);

  return (
    <>
      <article className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        {/* Artikeldaten für Google (Titel, Autorin, Datum) – unsichtbar */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
        <nav aria-label="Brotkrümel" className="text-sm text-muted">
          <Link href="/blog" className="hover:text-accent">
            Blog
          </Link>{" "}
          /{" "}
          <Link href={`/blog/kategorie/${post.category}`} className="hover:text-accent">
            {categoryLabel(post.category)}
          </Link>
        </nav>
        <header className="flex flex-col gap-4">
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
          <p className="text-muted">
            {post.author && <>von {post.author} · </>}
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time> · {readingMinutes(post.body)} Min. Lesezeit
          </p>
        </header>
        {post.coverImage && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-blush">
            <SanityImage image={post.coverImage} alt={post.title} sizes="(min-width: 768px) 768px, 100vw" priority crop={{ width: 1536, height: 960 }} />
          </div>
        )}
        <PostBody value={post.body} />
      </article>

      {courses.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Lust, das selbst zu lernen?</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Weiterlesen</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <li key={p._id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaBand settings={settings} />
    </>
  );
}
