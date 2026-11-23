import Link from "next/link";
import { categoryLabel, formatPostDate } from "@/lib/blog";
import type { Post } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-moss transition hover:-translate-y-1 hover:shadow-xl hover:shadow-plum/10 ${large ? "md:flex-row" : ""}`}
    >
      <div className={`relative aspect-[4/3] shrink-0 bg-blush ${large ? "md:aspect-auto md:w-1/2" : ""}`}>
        <SanityImage
          image={post.coverImage}
          alt=""
          decorative
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          crop={{ width: 900, height: 675 }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-moss/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          {categoryLabel(post.category)}
        </span>
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-6 ${large ? "md:justify-center md:p-10" : ""}`}>
        <p className="text-sm text-muted">
          {formatPostDate(post.publishedAt)}
          {post.author && ` · ${post.author}`}
        </p>
        <h3 className={`font-display font-semibold leading-tight group-hover:text-accent ${large ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
          {post.title}
        </h3>
        {post.excerpt && <p className={`text-muted ${large ? "text-lg" : "line-clamp-3"}`}>{post.excerpt}</p>}
        <span className="mt-auto pt-2 font-semibold text-accent">Weiterlesen →</span>
      </div>
    </Link>
  );
}
