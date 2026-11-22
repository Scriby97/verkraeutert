import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { kindLabel, seatsNote } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { RichText } from "@/components/RichText";
import { formatDate, formatPrice } from "@/lib/format";
import { getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { underConstruction } from "@/lib/site";
import { jsonLdScript, productJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

async function findProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === decodeURIComponent(slug));
}

export async function generateMetadata({ params }: PageProps<"/kurse/[slug]">): Promise<Metadata> {
  const product = await findProduct((await params).slug);
  if (!product) return {};
  // Im Aufbau: überall das Bild mit Kurkuma-Stempel aus dem Layout
  const image = underConstruction ? null : imageUrl(product.images?.[0], { width: 1200, height: 630 });
  return {
    title: product.name,
    description: product.description ?? undefined,
    alternates: { canonical: `/kurse/${product.slug}` },
    ...(image && { openGraph: { images: [{ url: image, width: 1200, height: 630 }] } }),
  };
}

export default async function ProductPage({ params }: PageProps<"/kurse/[slug]">) {
  const [product, settings] = await Promise.all([findProduct((await params).slug), getSettings()]);
  if (!product) notFound();
  const images = (product.images ?? []).flatMap((image) => {
    const src = imageUrl(image);
    return src ? [{ src, alt: image.alt || product.name }] : [];
  });
  const note = seatsNote(product);
  const orderable = product.available && !product.soldOut;
  const jsonLd = productJsonLd(product, images.map((i) => i.src), settings);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Kursdaten für Google (Datum, Ort, Preis) – unsichtbar */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <nav aria-label="Brotkrümel" className="mb-6 text-sm text-muted">
        <Link href="/kurse" className="hover:text-accent">
          Kurse & Shop
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="overflow-hidden rounded-[2rem] border border-ink bg-white pb-4 lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={images} sizes="(min-width: 1024px) 55vw, 100vw" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{kindLabel[product.kind] ?? product.kind}</p>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">{product.name}</h1>
            <p>
              <span className="font-display text-3xl font-semibold">{formatPrice(product.price ?? 0)}</span>
              {product.priceNote && <span className="text-muted"> {product.priceNote}</span>}
            </p>
          </div>

          {product.kind === "event" && (
            <dl className="grid gap-3 rounded-2xl bg-blush p-5 sm:grid-cols-2">
              {product.schedule.length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-wider text-accent">Kurstage</dt>
                  <dd>
                    <ul className="mt-1 flex flex-col gap-1 font-medium">
                      {product.schedule.map((day) => (
                        <li key={day}>{day}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ) : (
                <>
                  {product.date && <Detail label="Datum" value={formatDate(product.date)} />}
                  {product.time && <Detail label="Zeit" value={product.time} />}
                </>
              )}
              {product.location && <Detail label="Ort" value={product.location} />}
              {note && <Detail label="Plätze" value={note} />}
            </dl>
          )}
          {product.kind === "course" && product.location && (
            <dl className="rounded-2xl bg-blush p-5">
              <Detail label="Ort" value={product.location} />
            </dl>
          )}

          {product.description && <p className="text-lg text-muted">{product.description}</p>}

          {product.available ? (
            <AddToCart
              slug={product.slug}
              kind={product.kind}
              seats={product.seats}
              soldOut={product.soldOut}
              giftFields={product.giftFields}
            />
          ) : (
            <p className="rounded-2xl bg-blush p-5 text-muted">Dieses Angebot ist im Moment nicht buchbar.</p>
          )}
          {orderable && product.kind === "course" && (
            <p className="text-sm text-muted">Nach der Anmeldung melden wir uns bei dir, um Datum und Ort abzustimmen.</p>
          )}

          <RichText value={product.details} className="border-t border-line pt-6 leading-relaxed text-muted" />
          {settings.orderInfo && (
            <details className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-semibold">So funktioniert die Anmeldung</summary>
              <RichText value={settings.orderInfo} className="mt-4 text-muted" />
            </details>
          )}
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-accent">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
