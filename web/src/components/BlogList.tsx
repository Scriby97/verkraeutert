import Link from "next/link";
import { postCategories } from "@/lib/blog";
import type { Post, SiteSettings } from "@/lib/sanity";
import { PostCard } from "./PostCard";

// Blog-Übersicht: neuester Artikel gross, darunter die übrigen. Kategorien als eigene Seiten (gut für Google).
export function BlogList({ settings, posts, category }: { settings: SiteSettings; posts: Post[]; category?: string }) {
  const [first, ...rest] = posts;
  const active = postCategories.find((c) => c.value === category);
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="eyebrow">Blog{active && ` · ${active.label}`}</p>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
          {active ? active.label : (settings.blogTitle ?? "Blog")}
        </h1>
        {settings.blogIntro && !active && <p className="text-lg text-muted sm:text-xl">{settings.blogIntro}</p>}
      </header>

      <nav aria-label="Kategorien" className="flex flex-wrap gap-2">
        <CategoryLink href="/blog" current={!active}>
          Alle Artikel
        </CategoryLink>
        {postCategories.map((c) => (
          <CategoryLink key={c.value} href={`/blog/kategorie/${c.value}`} current={active?.value === c.value}>
            {c.label}
          </CategoryLink>
        ))}
      </nav>

      {first ? (
        <>
          <PostCard post={first} large />
          {rest.length > 0 && (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post._id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-lg text-muted">In dieser Kategorie gibt es noch keine Artikel.</p>
      )}
    </div>
  );
}

function CategoryLink({ href, current, children }: { href: string; current: boolean; children: string }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        current ? "border-accent bg-accent text-cream" : "border-line bg-moss text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}
