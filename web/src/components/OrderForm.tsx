"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { clearCart, pruneCart, setQuantity, useCart, usePrunedCount } from "@/lib/cart";
import { formatDate, formatPrice } from "@/lib/format";
import { inputClass, sendForm, web3formsKey } from "@/lib/web3forms";
import { ConfirmationCopy } from "./ConfirmationCopy";

export type OrderProduct = {
  slug: string;
  name: string;
  price: number;
  kind: string;
  date?: string | null;
  /** Freie Plätze; null = nicht gezählt */
  seats?: number | null;
};
type Status = "idle" | "sending" | "success" | "error";
type Payment = "transfer" | "twint";
type Delivery = "pickup" | "post";
type Placed = { orderNo: string; total: number; payment: Payment; email: string; summary: string };
export type BankAccount = { holder?: string | null; iban?: string | null };

// Kurze, gut lesbare Nummer, damit Zahlungen (TWINT, Überweisung) der Anmeldung zugeordnet werden können
function newOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear() % 100}`.padStart(2, "0") + `${d.getMonth() + 1}`.padStart(2, "0") + `${d.getDate()}`.padStart(2, "0");
  return `VK-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function OrderForm({
  products,
  twintQrUrl,
  bank,
  shippingFee,
}: {
  products: OrderProduct[];
  twintQrUrl?: string | null;
  /** Für «Überweisung»: erscheint nach dem Absenden. Ohne IBAN folgt eine Rechnung per E-Mail. */
  bank?: BankAccount | null;
  /** Versandkosten für Produkte; null = nur Abholung am Kurs */
  shippingFee?: number | null;
}) {
  const cart = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [payment, setPayment] = useState<Payment>(twintQrUrl ? "twint" : "transfer");
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const removed = usePrunedCount();

  // Angebote, die es nicht mehr gibt (gelöscht, ausgeblendet, ausgebucht, vorbei), aus dem Browser-Speicher entfernen
  useEffect(() => pruneCart(products.map((p) => p.slug)), [products]);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = cart.flatMap((item) => {
    const product = bySlug.get(item.slug);
    return product ? [{ ...item, product }] : [];
  });
  // Mehr Plätze im Warenkorb als frei (z. B. inzwischen andere Buchungen)? Dann nicht absenden lassen
  const booked = new Map<string, number>();
  for (const l of lines) booked.set(l.slug, (booked.get(l.slug) ?? 0) + l.quantity);
  const overbooked = lines.filter((l) => typeof l.product.seats === "number" && booked.get(l.slug)! > l.product.seats);
  const hasCourses = lines.some((l) => l.product.kind === "course");
  const hasItems = lines.some((l) => l.product.kind === "item");
  const canShip = hasItems && typeof shippingFee === "number";
  const shipping = canShip && delivery === "post" ? shippingFee : 0;
  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0) + shipping;
  const paymentMethod: Payment = twintQrUrl ? payment : "transfer";
  const iban = bank?.iban?.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (overbooked.length) return;
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const orderNo = newOrderNumber();
    const order = lines
      .map((l) => {
        const details = [
          l.product.kind === "event" && l.product.date && `Termin: ${formatDate(l.product.date)}`,
          l.recipient && `Für: ${l.recipient}`,
          l.greeting && `Grusstext: «${l.greeting}»`,
        ]
          .filter(Boolean)
          .map((d) => `\n    → ${d}`)
          .join("");
        return `${l.quantity} × ${l.product.name} à ${formatPrice(l.product.price)}${details}`;
      })
      .concat(hasItems ? [canShip && delivery === "post" ? `Versand per Post: ${formatPrice(shipping)}` : "Produkte: Abholung am Kurs"] : [])
      .join("\n");
    const phone = String(form.get("phone") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const nextSteps = [
      paymentMethod === "twint"
        ? `Bezahlung per TWINT: ${formatPrice(total)} an Verkräutert, wenn möglich mit der Bestellnummer als Mitteilung.`
        : iban
          ? `Bezahlung per Überweisung: ${formatPrice(total)} an ${bank?.holder ?? "Verkräutert"}, IBAN ${iban}, Mitteilung: ${orderNo}.`
          : "Du erhältst in den nächsten Tagen eine Rechnung per E-Mail.",
      lines.some((l) => l.product.kind === "voucher") && "Den Gutschein schicken wir dir nach dem Zahlungseingang per E-Mail.",
      hasCourses && "Für den Kurs nach Absprache melden wir uns bei dir, um Datum und Ort abzustimmen.",
      lines.some((l) => l.product.kind === "event") && "Vor dem Kurs erhältst du von uns alle Details zum Treffpunkt.",
    ]
      .filter(Boolean)
      .join(" ");
    // Kopie für die Kundin/den Kunden (Anzeige, Mail an sich selbst, Ausdruck)
    const summary = [
      `Bestellnummer: ${orderNo}`,
      `Datum: ${new Date().toLocaleDateString("de-CH")}`,
      "",
      order,
      "",
      `Total: ${formatPrice(total)}`,
      `Zahlung: ${paymentMethod === "twint" ? "TWINT" : "Überweisung"}`,
      "",
      `Name: ${form.get("name")}`,
      `E-Mail: ${form.get("email")}`,
      phone ? `Telefon: ${phone}` : null,
      address ? `Adresse:\n${address}` : null,
      message ? `Nachricht: ${message}` : null,
      "",
      nextSteps,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await sendForm({
        subject: `Neue Anmeldung/Bestellung ${orderNo} von ${form.get("name")}`,
        botcheck: form.get("botcheck"),
        Bestellnummer: orderNo,
        Zahlungsart:
          paymentMethod === "twint"
            ? "TWINT – bezahlt direkt nach der Anmeldung per QR-Code (Zahlungseingang prüfen)"
            : iban
              ? "Überweisung mit Bestellnummer als Mitteilung (Zahlungseingang prüfen)"
              : "Überweisung – bitte Rechnung per E-Mail schicken",
        Name: form.get("name"),
        email: form.get("email"),
        Telefon: phone || "–",
        Adresse: address || "–",
        Bestellung: order,
        Total: formatPrice(total),
        Nachricht: message || "–",
      });
      setPlaced({ orderNo, total, payment: paymentMethod, email: String(form.get("email")), summary });
      // Freie Plätze herunterzählen (Cloudflare-Worker); scheitert das, ist die Bestellung trotzdem verschickt
      const counted = lines.filter((l) => typeof l.product.seats === "number");
      if (counted.length) {
        fetch("/api/seats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: counted.map((l) => ({ slug: l.slug, quantity: l.quantity })) }),
          keepalive: true,
        }).catch(() => {});
      }
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && placed) {
    return (
      <div className="flex flex-col gap-6 rounded-3xl bg-moss p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-semibold">Vielen Dank für deine Anmeldung!</h2>
          <p className="text-muted">
            Bestellnummer <strong className="text-ink">{placed.orderNo}</strong>
          </p>
        </div>
        {placed.payment === "twint" && twintQrUrl ? (
          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <div className="relative mx-auto aspect-square w-52">
              <Image src={twintQrUrl} alt="TWINT-QR-Code von Verkräutert" fill sizes="208px" loading="eager" className="object-contain" />
            </div>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted">
              <li>TWINT-App öffnen und den QR-Code scannen.</li>
              <li>
                Betrag eingeben: <strong className="text-lg text-ink">{formatPrice(placed.total)}</strong>
              </li>
              <li>
                Falls möglich die Bestellnummer <strong className="text-ink">{placed.orderNo}</strong> als Mitteilung angeben.
              </li>
              <li>Zahlung bestätigen – fertig!</li>
            </ol>
          </div>
        ) : iban ? (
          <div className="flex flex-col gap-2 rounded-2xl bg-blush p-5">
            <p className="font-semibold">Bitte überweise {formatPrice(placed.total)} innert 10 Tagen auf:</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted">
              {bank?.holder && (
                <>
                  <dt>Kontoinhaberin</dt>
                  <dd className="text-ink">{bank.holder}</dd>
                </>
              )}
              <dt>IBAN</dt>
              <dd className="font-mono text-ink">{iban}</dd>
              <dt>Mitteilung</dt>
              <dd className="text-ink">{placed.orderNo}</dd>
            </dl>
          </div>
        ) : (
          <p className="text-muted">Du erhältst in den nächsten Tagen eine Rechnung per E-Mail.</p>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-semibold">Deine Anmeldung</h3>
          <ConfirmationCopy email={placed.email} subject={`Meine Anmeldung ${placed.orderNo} bei Verkräutert`} summary={placed.summary} />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        {removed > 0 && <RemovedNotice count={removed} />}
        <p className="text-lg text-muted">Dein Warenkorb ist noch leer.</p>
        <Link href="/kurse" className="btn-primary">
          Zu den Kursen
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {!web3formsKey && (
        <p className="rounded-xl bg-yellow-100 p-3 text-sm text-yellow-900">
          NEXT_PUBLIC_WEB3FORMS_KEY fehlt – das Formular kann noch nicht versendet werden.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <ul className="flex flex-col gap-3">
          {lines.map((l) => {
            const max = typeof l.product.seats === "number" ? l.product.seats : 99;
            return (
              <li key={l.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-moss p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{l.product.name}</p>
                  <p className="text-sm text-muted">
                    {[
                      formatPrice(l.product.price),
                      l.product.kind === "event" && l.product.date && formatDate(l.product.date),
                      l.recipient && `für ${l.recipient}`,
                      l.greeting && `«${l.greeting}»`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {overbooked.includes(l) && (
                    <p className="text-sm font-semibold text-accent">
                      Es {l.product.seats === 1 ? "ist nur noch 1 Platz" : `sind nur noch ${l.product.seats} Plätze`} frei – bitte die Anzahl anpassen.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(l.id, l.quantity - 1)}
                    className="size-9 rounded-full border border-line hover:border-accent"
                    aria-label={`${l.product.name}: eins weniger`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold" aria-label="Anzahl">
                    {l.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(l.id, l.quantity + 1)}
                    disabled={booked.get(l.slug)! >= max}
                    className="size-9 rounded-full border border-line hover:border-accent disabled:opacity-40"
                    aria-label={`${l.product.name}: eins mehr`}
                  >
                    +
                  </button>
                  <button type="button" onClick={() => setQuantity(l.id, 0)} className="ml-3 text-sm text-muted hover:text-accent">
                    Entfernen
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {removed > 0 && <RemovedNotice count={removed} />}
        {canShip && delivery === "post" && (
          <p className="ml-auto text-muted">
            Versand per Post <span className="ml-3 text-ink">{formatPrice(shipping)}</span>
          </p>
        )}
        <p className="ml-auto flex items-baseline gap-4 text-lg">
          <span className="text-muted">Total</span>
          <span className="font-display text-3xl font-semibold">{formatPrice(total)}</span>
        </p>
        <Link href="/kurse" className="self-start text-sm font-semibold text-accent hover:text-accent-dark">
          ← Weitere Kurse und Produkte
        </Link>
      </section>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 font-display text-2xl font-semibold">Deine Angaben</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Name
            <input name="name" required autoComplete="name" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            E-Mail
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Telefon <span className="font-normal text-muted">(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            {delivery === "post" && canShip ? (
              "Adresse für den Versand"
            ) : (
              <span>
                Adresse <span className="font-normal text-muted">(optional)</span>
              </span>
            )}
            <textarea
              name="address"
              rows={2}
              required={delivery === "post" && canShip}
              autoComplete="street-address"
              placeholder={"Strasse Nr.\nPLZ Ort"}
              className={inputClass}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nachricht <span className="font-normal text-muted">(optional{hasCourses ? " – z. B. Wunschdatum oder Anzahl Personen" : ""})</span>
          <textarea name="message" rows={3} className={inputClass} />
        </label>
        {/* Spam-Schutz: für Menschen unsichtbar, Bots füllen es aus */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      </fieldset>

      {canShip && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-3 font-display text-2xl font-semibold">Produkte erhalten</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} className="size-4 accent-accent" />
            Abholung am Kurs (gratis)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" checked={delivery === "post"} onChange={() => setDelivery("post")} className="size-4 accent-accent" />
            Versand per Post ({formatPrice(shippingFee)})
          </label>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-3 font-display text-2xl font-semibold">Bezahlung</legend>
        {twintQrUrl && (
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" checked={paymentMethod === "twint"} onChange={() => setPayment("twint")} className="size-4 accent-accent" />
            TWINT – direkt nach der Anmeldung bezahlen
          </label>
        )}
        <label className="flex items-center gap-2">
          <input type="radio" name="payment" checked={paymentMethod === "transfer"} onChange={() => setPayment("transfer")} className="size-4 accent-accent" />
          Überweisung {iban ? "(Bankangaben nach dem Absenden)" : "(Rechnung per E-Mail)"}
        </label>
      </fieldset>

      {status === "error" && (
        <p className="text-sm font-semibold text-accent">
          Die Anmeldung konnte nicht gesendet werden. Bitte versuche es nochmals oder schreib uns eine E-Mail.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "sending" || !web3formsKey || overbooked.length > 0}
          className="btn-primary self-start disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet …" : "Verbindlich anmelden"}
        </button>
        <p className="text-xs text-muted">
          {paymentMethod === "twint"
            ? "Nach dem Absenden zeigen wir dir den TWINT-QR-Code und den Betrag."
            : iban
              ? "Nach dem Absenden zeigen wir dir Betrag, IBAN und Bestellnummer für die Überweisung."
              : "Die Rechnung für die Überweisung erhältst du nach der Anmeldung per E-Mail."}{" "}
          Es gilt die{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function RemovedNotice({ count }: { count: number }) {
  return (
    <p className="rounded-xl bg-blush p-3 text-sm text-muted">
      {count === 1 ? "Ein Angebot ist" : `${count} Angebote sind`} nicht mehr buchbar und {count === 1 ? "wurde" : "wurden"} aus deinem
      Warenkorb entfernt.
    </p>
  );
}
