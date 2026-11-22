import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Blocks";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { getProducts, getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Wildkräuterkurse & Shop",
  description: "Wildkräuterkurse in Frick und Othmarsingen AG buchen: sammeln, bestimmen, verarbeiten – mit Jenny und Bettina von Verkräutert.",
  alternates: { canonical: "/kurse" },
};

export default async function CoursesPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const visible = products.filter((p) => p.available);
  const groups = [
    { id: "kurse", title: "Kurse", items: visible.filter((p) => p.kind === "event") },
    { id: "nach-absprache", title: "Kurse nach Absprache", items: visible.filter((p) => p.kind === "course") },
    { id: "shop", title: "Shop", items: visible.filter((p) => p.kind === "item") },
    { id: "gutscheine", title: "Gutscheine", items: visible.filter((p) => p.kind === "voucher") },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        image={settings.heroImage}
        eyebrow="Kurse & Shop"
        title="Wildkräuterkurse"
        intro={settings.shopIntro ?? "Lerne Wildkräuter sicher zu bestimmen, nachhaltig zu sammeln und genussvoll zu verarbeiten."}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-14 sm:px-6 sm:py-20">
        {groups.map((group, gi) => (
          <section key={group.id} id={group.id} className="flex flex-col gap-8" aria-labelledby={`gruppe-${group.id}`}>
            <div className="flex items-end justify-between gap-4 border-b border-ink pb-4">
              <h2 id={`gruppe-${group.id}`} className="font-display text-4xl italic sm:text-6xl">
                {group.title}
              </h2>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Nr. {String(gi + 1).padStart(2, "0")} · {group.items.length} {group.items.length === 1 ? "Angebot" : "Angebote"}
              </span>
            </div>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && (
          <p className="text-lg text-muted">Die nächsten Kurse sind in Planung. Schreib uns, dann informieren wir dich, sobald es Daten gibt.</p>
        )}
        {settings.orderInfo && (
          <section className="rounded-3xl bg-blush p-6 sm:p-10">
            <RichText value={settings.orderInfo} className="max-w-3xl text-lg text-muted" />
          </section>
        )}
      </div>
      <CtaBand
        settings={settings}
        title="Kurs für eure Gruppe?"
        text="Ein Kräuterspaziergang für Verein, Team oder Familie? Wir planen gerne einen Kurs nur für euch."
        href="/kontakt"
        label="Anfrage senden"
      />
    </>
  );
}
