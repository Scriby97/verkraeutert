import Link from "next/link";
import { CtaBand, Facts, SectionHeading, Testimonials } from "@/components/Blocks";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getPosts, getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { jsonLdScript, organizationJsonLd } from "@/lib/structured-data";

export default async function HomePage() {
  const [settings, products, posts] = await Promise.all([getSettings(), getProducts(), getPosts()]);
  // Nächste Kurse zuerst (getProducts sortiert nach Datum), höchstens drei Karten
  const featured = products.filter((p) => p.available).slice(0, 3);
  const latest = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd(settings, imageUrl(settings.logo))) }} />
      <section className="relative isolate overflow-hidden bg-plum text-white">
        <div className="absolute inset-0 -z-10">
          <SanityImage image={settings.heroImage} alt="" decorative sizes="100vw" priority crop={{ width: 2400, height: 1350 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/70 to-plum/25" aria-hidden />
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-end gap-10 px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
          <div className="flex max-w-3xl flex-col gap-5">
            {settings.heroEyebrow && <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sun">{settings.heroEyebrow}</p>}
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">{settings.heroTitle ?? settings.siteName}</h1>
            {settings.heroText && <p className="max-w-2xl text-lg text-white/85 sm:text-xl">{settings.heroText}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/kurse" className="btn-light">
                Kurse entdecken
              </Link>
              <Link href="/blog" className="btn border-2 border-white/60 text-white hover:border-white hover:bg-white/10">
                Zum Blog
              </Link>
            </div>
          </div>
          <Facts facts={settings.heroFacts} tone="dark" />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Kurse" title="Die nächsten Kurse">
                Wildkräuter sicher bestimmen, nachhaltig sammeln und genussvoll verarbeiten – ohne Vorwissen.
              </SectionHeading>
              <Link href="/kurse" className="btn-outline shrink-0">
                Alle Kurse
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {settings.introTitle && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-line">
            <SanityImage image={settings.introImage} alt="Jenny und Bettina" sizes="(min-width: 1024px) 50vw, 100vw" crop={{ width: 1200, height: 1500 }} />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Über uns" title={settings.introTitle} />
            <RichText value={settings.introText} className="text-lg text-muted" />
            <Link href="/ueber-uns" className="btn-outline self-start">
              Jenny & Bettina kennenlernen
            </Link>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="bg-blush">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Blog" title={settings.blogTitle ?? "Aus dem Blog"}>
                {settings.blogIntro}
              </SectionHeading>
              <Link href="/blog" className="btn-outline shrink-0">
                Alle Artikel
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <li key={post._id}>
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
