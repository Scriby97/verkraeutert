import type { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";
import { getProducts, getSettings, imageUrl } from "@/lib/sanity";

export const metadata: Metadata = { title: "Warenkorb & Anmeldung", robots: { index: false }, alternates: { canonical: "/warenkorb" } };

export default async function CartPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  // Nur Angebote, die man im Moment buchen kann; andere fallen beim Öffnen aus dem Warenkorb
  const orderable = products
    .filter((p) => p.available && !p.soldOut)
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price ?? 0, kind: p.kind, date: p.date, seats: p.seats }));

  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Warenkorb & Anmeldung</h1>
      <OrderForm products={orderable} twintQrUrl={imageUrl(settings.twintQr)} bank={settings.bankAccount} shippingFee={settings.shippingFee} />
    </section>
  );
}
