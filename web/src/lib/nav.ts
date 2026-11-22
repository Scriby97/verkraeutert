import type { Page } from "./sanity";

export type NavLink = { href: string; label: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "links" in item;

// Menü: Kurse, Blog, Über uns, Kontakt. Weitere Seiten aus dem Studio («Im Menü unter Angebot») klappen
// unter «Angebot» auf; ohne solche Seiten gibt es dieses Untermenü nicht.
export function buildNav(pages: Pick<Page, "slug" | "title" | "menuTitle" | "menu">[]): NavItem[] {
  const angebot = pages.filter((p) => p.menu === "angebot").map((p) => ({ href: `/${p.slug}`, label: p.menuTitle || p.title }));
  const items: NavItem[] = [{ href: "/kurse", label: "Kurse & Shop" }];
  if (angebot.length) items.push({ label: "Angebot", links: angebot });
  items.push({ href: "/blog", label: "Blog" }, { href: "/ueber-uns", label: "Über uns" }, { href: "/kontakt", label: "Kontakt" });
  return items;
}

export function footerPages(pages: Pick<Page, "slug" | "title" | "menuTitle" | "menu">[]): NavLink[] {
  return pages.filter((p) => p.menu === "footer").map((p) => ({ href: `/${p.slug}`, label: p.menuTitle || p.title }));
}
