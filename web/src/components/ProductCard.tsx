import Link from "next/link";
import { dateBadge, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

export const kindLabel: Record<string, string> = { event: "Kurs", course: "Kurs nach Absprache", item: "Produkt", voucher: "Gutschein" };

export function seatsNote(product: Pick<Product, "seats" | "soldOut">) {
  if (product.soldOut) return "Ausgebucht";
  if (typeof product.seats === "number" && product.seats <= 5) return product.seats === 1 ? "Nur noch 1 Platz" : `Nur noch ${product.seats} Plätze`;
  return null;
}

// Karte wie ein Eintrittsticket: Foto, Perforation, Datumsstempel
export function ProductCard({ product }: { product: Product }) {
  const badge = product.kind === "event" && product.date ? dateBadge(product.date) : null;
  const note = seatsNote(product);
  return (
    <Link
      href={`/kurse/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/80 bg-white transition duration-300 hover:-rotate-1 hover:shadow-[8px_8px_0_0_var(--color-ink)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-blush">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
          <SanityImage image={product.images?.[0]} alt="" decorative sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" crop={{ width: 900, height: 720 }} />
        </div>
        <span className="label-tag absolute left-4 top-4 border-ink bg-cream text-ink">{kindLabel[product.kind] ?? product.kind}</span>
        {note && (
          <span className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${product.soldOut ? "bg-ink text-cream" : "bg-sun text-ink"}`}>
            {note}
          </span>
        )}
      </div>
      <div className="ticket-perforation h-3 border-y border-dashed border-ink/30 bg-plum" aria-hidden />
      <div className="flex flex-1 gap-5 p-6">
        {badge && (
          <span className="flex shrink-0 flex-col items-center justify-center self-start rounded-full border border-ink px-3 py-2 leading-none">
            <span className="font-display text-4xl italic">{badge.day}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">{badge.month}</span>
          </span>
        )}
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="font-display text-2xl leading-tight decoration-sun decoration-[6px] underline-offset-4 group-hover:underline">{product.name}</h3>
          {product.description && <p className="line-clamp-3 text-sm text-muted">{product.description}</p>}
          <p className="mt-auto flex items-baseline justify-between gap-3 border-t border-dashed border-ink/30 pt-3">
            <span className="font-display text-2xl">{formatPrice(product.price ?? 0)}</span>
            {product.priceNote && <span className="text-right font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{product.priceNote}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
}
