import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand, Testimonials } from "@/components/Blocks";
import { Cauldron } from "@/components/magic/Cauldron";
import { ForestQuest } from "@/components/magic/ForestQuest";
import { RiddleCards } from "@/components/magic/RiddleCards";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getPosts, getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { jsonLdScript, organizationJsonLd } from "@/lib/structured-data";

// Startseite als kleines Abenteuer in drei Kapiteln: Gesucht (Laterne im Wald), Gefunden (Rätselkarten),
// Verkräutert (Zauberkessel) – danach die Expeditionen (Kurse), Jenny & Bettina und die Geschichten (Blog).
export default async function HomePage() {
  const [settings, products, posts] = await Promise.all([getSettings(), getProducts(), getPosts()]);
  const featured = products.filter((p) => p.available).slice(0, 3);
  const latest = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(settings, imageUrl(settings.logo))) }} />

      <ForestQuest>
        {settings.heroEyebrow && <p className="eyebrow">{settings.heroEyebrow}</p>}
        <h1 id="wald-titel" className="glow font-display text-5xl font-semibold leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
          {settings.heroTitle ?? settings.siteName}
        </h1>
        {settings.heroText && <p className="max-w-2xl text-lg text-ink/85 sm:text-xl">{settings.heroText}</p>}
        <div className="flex flex-wrap gap-3">
          <Link href="/kurse" className="btn-primary">
            Kurse entdecken
          </Link>
          <Link href="/blog" className="btn-outline">
            Zum Blog
          </Link>
        </div>
      </ForestQuest>

      <Chapter
        id="kapitel-2"
        number="II"
        word="Gefunden"
        title="Wer bin ich? Löse die Kräuterrätsel"
        intro="Vier Kräuter, vier Rätsel. Rate zuerst – dann dreh die Karte um und erfahre, wie du das Kraut verwendest und worauf du beim Sammeln achten musst."
      >
        <RiddleCards />
      </Chapter>

      <Chapter
        id="kapitel-3"
        number="III"
        word="Verkräutert"
        title="Braue deinen eigenen Kräutertrank"
        intro="Wirf drei Kräuter in den Kessel und schau, was daraus entsteht. In der echten Küche wird daraus übrigens etwas sehr Leckeres."
      >
        <Cauldron />
      </Chapter>

      {featured.length > 0 && (
        <section className="relative border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="flex max-w-3xl flex-col gap-3">
                <p className="eyebrow">Expeditionen</p>
                <h2 className="glow font-display text-4xl font-semibold sm:text-6xl">Die nächsten Kurse</h2>
                <p className="text-lg text-muted">Raus aus dem Bildschirm, rein in Wald und Wiese – mit Jenny und Bettina, ohne Vorwissen.</p>
              </div>
              <Link href="/kurse" className="btn-outline shrink-0">
                Alle Kurse
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <li key={product._id} className="reveal">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {settings.introTitle && (
        <section className="relative overflow-hidden border-t border-line bg-plum">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(233,196,106,0.35),transparent_65%)]" aria-hidden />
              <div className="absolute inset-6 overflow-hidden rounded-full border-2 border-accent/60 shadow-[0_0_60px_-10px_rgba(233,196,106,0.7)]">
                <SanityImage image={settings.introImage} alt="Jenny und Bettina" sizes="(min-width: 1024px) 30vw, 80vw" crop={{ width: 900, height: 900 }} />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Eure Wegbegleiterinnen</p>
              <h2 className="glow font-display text-4xl font-semibold sm:text-6xl">{settings.introTitle}</h2>
              <RichText value={settings.introText} className="text-lg text-muted" />
              <Link href="/ueber-uns" className="btn-outline self-start">
                Jenny & Bettina kennenlernen
              </Link>
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="flex max-w-3xl flex-col gap-3">
                <p className="eyebrow">Geschichten aus dem Wald</p>
                <h2 className="glow font-display text-4xl font-semibold sm:text-6xl">{settings.blogTitle ?? "Aus dem Blog"}</h2>
                {settings.blogIntro && <p className="text-lg text-muted">{settings.blogIntro}</p>}
              </div>
              <Link href="/blog" className="btn-outline shrink-0">
                Alle Artikel
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <li key={post._id} className="reveal">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Testimonials items={settings.testimonials} />
      <CtaBand settings={settings} />
    </>
  );
}

/** Kapitel des Abenteuers: grosse römische Zahl, Stichwort aus dem Slogan, Titel, Einleitung, interaktiver Teil */
function Chapter({
  id,
  number,
  word,
  title,
  intro,
  children,
}: {
  id: string;
  number: string;
  word: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-10">
          <span className="glow font-display text-8xl italic leading-none text-accent sm:text-9xl" aria-hidden>
            {number}
          </span>
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="eyebrow">
              Kapitel {number} · {word}
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">{title}</h2>
            <p className="text-lg text-muted">{intro}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
