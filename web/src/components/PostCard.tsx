import Link from "next/link";
import { categoryLabel, formatPostDate } from "@/lib/blog";
import type { Post } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

// Feldnotiz: grosse Nummer, Foto im Bogen, Titel mit kursiver Schrift
export function PostCard({ post, large = false, index }: { post: Post; large?: boolean; index?: number }) {
  const number = typeof index === "number" ? String(index + 1).padStart(2, "0") : null;
  if (large) {
    return (
      <Link href={`/blog/${post.slug}`} className="group grid items-center gap-8 md:grid-cols-[1fr_1.1fr] md:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden arch bg-blush">
          <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
            <SanityImage image={post.coverImage} alt="" decorative sizes="(min-width: 768px) 45vw, 100vw" crop={{ width: 1000, height: 1250 }} />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <p className="flex flex-wrap items-center gap-3">
            <span className="label-tag text-accent">{categoryLabel(post.category)}</span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {formatPostDate(post.publishedAt)}
              {post.author && ` · ${post.author}`}
            </span>
          </p>
          <h3 className="font-display text-4xl leading-[0.98] sm:text-6xl">
            <span className="bg-[linear-gradient(var(--color-sun),var(--color-sun))] bg-[length:0%_40%] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_40%]">
              {post.title}
            </span>
          </h3>
          {post.excerpt && <p className="max-w-xl text-lg text-muted">{post.excerpt}</p>}
          <span className="btn-primary self-start">
            Weiterlesen <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-blush">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105 group-hover:rotate-1">
          <SanityImage
            image={post.coverImage}
            alt=""
            decorative
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            crop={{ width: 900, height: 675 }}
          />
        </div>
        {number && (
          <span className="absolute left-4 top-4 flex size-16 items-center justify-center rounded-full bg-plum font-display text-3xl italic text-sun" aria-hidden>
            {number}
          </span>
        )}
        <span className="label-tag absolute right-4 top-4 border-ink bg-cream text-ink">{categoryLabel(post.category)}</span>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
        {formatPostDate(post.publishedAt)}
        {post.author && ` · ${post.author}`}
      </p>
      <h3 className="font-display text-2xl leading-tight decoration-sun decoration-[6px] underline-offset-4 group-hover:underline sm:text-3xl">{post.title}</h3>
      {post.excerpt && <p className="line-clamp-3 text-muted">{post.excerpt}</p>}
      <span className="mt-auto font-semibold text-accent">Weiterlesen →</span>
    </Link>
  );
}
