import Link from "next/link";
import { postCategories } from "@/lib/blog";
import type { Post, SiteSettings } from "@/lib/sanity";
import { AccentTitle } from "./Blocks";
import { PostCard } from "./PostCard";

// Blog-Übersicht: neuester Artikel gross, darunter die übrigen. Kategorien als eigene Seiten (gut für Google).
export function BlogList({ settings, posts, category }: { settings: SiteSettings; posts: Post[]; category?: string }) {
  const [first, ...rest] = posts;
  const active = postCategories.find((c) => c.value === category);
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="eyebrow">Blog{active && ` · ${active.label}`}</p>
        <h1 className="font-display text-6xl leading-[0.9] sm:text-8xl">
          <AccentTitle text={active ? active.label : (settings.blogTitle ?? "Blog")} />
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
            <ul className="grid gap-x-8 gap-y-14 border-t border-ink/20 pt-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <li key={post._id} className="reveal">
                  <PostCard post={post} index={i + 1} />
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
      className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition ${
        current ? "border-ink bg-ink text-sun" : "border-ink/40 text-ink hover:border-ink hover:bg-sun"
      }`}
    >
      {children}
    </Link>
  );
}
