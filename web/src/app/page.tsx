import Link from "next/link";
import { AccentTitle, CtaBand, Facts, Marquee, RotatingBadge, SectionHeading, Testimonials } from "@/components/Blocks";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getPosts, getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { jsonLdScript, organizationJsonLd } from "@/lib/structured-data";

// Kräuter fürs Laufband – die Pflanzen aus Kursen und Blog
const herbs = ["Bärlauch", "Giersch", "Knoblauchsrauke", "Brennnessel", "Spitzwegerich", "Gundermann", "Löwenzahn", "Vogelmiere", "Schafgarbe"];

export default async function HomePage() {
  const [settings, products, posts] = await Promise.all([getSettings(), getProducts(), getPosts()]);
  // Nächste Kurse zuerst (getProducts sortiert nach Datum), höchstens drei Karten
  const featured = products.filter((p) => p.available).slice(0, 3);
  const latest = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(settings, imageUrl(settings.logo))) }} />

      {/* Kopf: riesiger Titel, Foto im Bogen, drehender Kreistext */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        <div className="flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-7">
            {settings.heroEyebrow && <p className="eyebrow hero-word">{settings.heroEyebrow}</p>}
            <h1 className="hero-word font-display text-[clamp(3.6rem,8.6vw,8.4rem)] leading-[0.86]">
              <AccentTitle text={settings.heroTitle ?? settings.siteName ?? "Verkräutert"} />
            </h1>
            {settings.heroText && <p className="hero-word max-w-xl text-lg text-muted sm:text-xl">{settings.heroText}</p>}
            <div className="flex flex-wrap gap-3">
              <Link href="/kurse" className="btn-primary px-7 py-4 text-lg">
                Kurse entdecken <span aria-hidden>↗</span>
              </Link>
              <Link href="/blog" className="btn-outline px-7 py-4 text-lg">
                Zum Blog
              </Link>
            </div>
          </div>
          <Facts facts={settings.heroFacts} />
        </div>

        <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden arch border border-ink bg-blush">
            <SanityImage image={settings.heroImage} alt="" decorative sizes="(min-width: 1024px) 40vw, 90vw" priority crop={{ width: 1100, height: 1375 }} />
          </div>
          <RotatingBadge text="Gesucht · Gefunden · Verkräutert · " className="absolute -left-4 top-16 sm:-left-12" />
          {settings.heroImage?.alt && (
            <figcaption className="mt-4 flex gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <span className="text-accent">Fig. 01</span>
              <span>{settings.heroImage.alt}</span>
            </figcaption>
          )}
        </figure>
      </section>

      <Marquee items={herbs} />

      {featured.length > 0 && (
        <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Kurse · Frick & Othmarsingen" title="Die nächsten Kurse">
              Wildkräuter sicher bestimmen, nachhaltig sammeln und genussvoll verarbeiten – ohne Vorwissen.
            </SectionHeading>
            <Link href="/kurse" className="btn-outline shrink-0">
              Alle Kurse
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <li key={product._id} className={`reveal ${i === 1 ? "lg:mt-10" : ""}`}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {settings.introTitle && (
        <section className="relative overflow-hidden bg-plum text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -right-6 -top-6 size-40 rounded-full bg-sun" aria-hidden />
              <div className="relative -rotate-3 bg-cream p-3 pb-14 shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden bg-blush">
                  <SanityImage image={settings.introImage} alt="Jenny und Bettina" sizes="(min-width: 1024px) 35vw, 90vw" crop={{ width: 900, height: 1125 }} />
                </div>
                <p className="absolute bottom-4 left-0 right-0 text-center font-display text-xl italic text-ink">Jenny & Bettina</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun">Über uns</p>
              <h2 className="font-display text-5xl leading-[0.92] sm:text-7xl">
                <AccentTitle text={settings.introTitle} />
              </h2>
              <RichText value={settings.introText} className="text-lg text-white/85" />
              <Link href="/ueber-uns" className="btn-light self-start">
                Jenny & Bettina kennenlernen
              </Link>
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Feldnotizen · Blog" title={settings.blogTitle ?? "Aus dem Blog"}>
              {settings.blogIntro}
            </SectionHeading>
            <Link href="/blog" className="btn-outline shrink-0">
              Alle Artikel
            </Link>
          </div>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, i) => (
              <li key={post._id} className="reveal">
                <PostCard post={post} index={i} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Testimonials items={settings.testimonials} />
      <CtaBand settings={settings} />
    </>
  );
}
