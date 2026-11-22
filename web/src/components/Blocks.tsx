import Link from "next/link";
import type { ReactNode } from "react";
import type { SanityImage as SanityImageType, SiteSettings } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

type Fact = { _key: string; value: string; label?: string | null };

/** Titel mit Kursiv-Akzent: das letzte Wort steht kursiv («Entdecke die Welt der *Wildkräuter*») */
export function AccentTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return <em>{text}</em>;
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}

/** Seitenkopf: riesiger Titel links, Bild im Bogen rechts */
export function PageHero({
  image,
  eyebrow,
  title,
  intro,
  children,
}: {
  image?: SanityImageType | null;
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display text-6xl leading-[0.92] sm:text-8xl">
          <AccentTitle text={title} />
        </h1>
        {intro && <p className="max-w-2xl text-lg text-muted sm:text-xl">{intro}</p>}
        {children}
      </div>
      {image && (
        <div className="relative hidden aspect-[4/5] overflow-hidden arch bg-blush lg:block">
          <SanityImage image={image} alt="" decorative sizes="35vw" priority crop={{ width: 900, height: 1125 }} />
        </div>
      )}
    </section>
  );
}

/** Eckdaten als Etiketten-Reihe */
export function Facts({ facts, tone = "light" }: { facts?: Fact[] | null; tone?: "light" | "dark" }) {
  if (!facts?.length) return null;
  const dark = tone === "dark";
  return (
    <dl className={`grid border-t ${dark ? "border-white/25" : "border-ink/20"} ${facts.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {facts.map((fact, i) => (
        <div key={fact._key} className={`flex flex-col gap-1 py-5 sm:px-6 sm:first:pl-0 ${i > 0 ? `sm:border-l ${dark ? "sm:border-white/25" : "sm:border-ink/20"}` : ""}`}>
          <dt className="sr-only">{fact.label}</dt>
          <dd className={`font-mono text-[11px] uppercase tracking-[0.18em] ${dark ? "text-sun" : "text-accent"}`}>Nr. {String(i + 1).padStart(2, "0")}</dd>
          <dd className={`font-display text-2xl italic leading-tight hyphens-auto sm:text-3xl ${dark ? "text-white" : "text-ink"}`}>{fact.value}</dd>
          {fact.label && <dd className={dark ? "text-white/80" : "text-muted"}>{fact.label}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string | null; title: string; children?: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display text-4xl leading-[0.95] sm:text-6xl">
        <AccentTitle text={title} />
      </h2>
      {children && <div className="text-lg text-muted">{children}</div>}
    </div>
  );
}

/** Laufband mit Kräuternamen */
export function Marquee({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "lime" }) {
  const row = items.flatMap((item) => [item, "✺"]);
  return (
    <div
      className={`overflow-hidden border-y py-4 ${tone === "dark" ? "border-plum bg-plum text-sun" : "border-ink bg-sun text-ink"}`}
      aria-hidden
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center gap-8 pr-8 font-display text-3xl italic sm:text-5xl">
            {row.map((word, i) => (
              <span key={`${copy}-${i}`}>{word}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Kreistext wie im Logo, dreht sich langsam */
export function RotatingBadge({ text, className = "relative" }: { text: string; className?: string }) {
  // className bestimmt die Position (Standard: im Fluss); «absolute …» legt den Kreis über ein Bild
  return (
    <div className={`flex size-36 items-center justify-center rounded-full bg-sun text-ink shadow-lg ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 size-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-mono text-[15px] uppercase tracking-[0.32em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-display text-4xl italic">✺</span>
    </div>
  );
}

/** Aufruf am Ende einer Seite: Waldgrün, riesige Kursivschrift, Limetten-Knopf */
export function CtaBand({
  title,
  text,
  href = "/kurse",
  label = "Kurs buchen",
  settings,
}: {
  title?: string | null;
  text?: string | null;
  href?: string | null;
  label?: string | null;
  settings: SiteSettings;
}) {
  const whatsapp = settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null;
  return (
    <section className="px-3 py-16 sm:px-5">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-plum px-6 py-14 text-white sm:px-14 sm:py-20">
        <svg viewBox="0 0 200 200" className="sway pointer-events-none absolute -bottom-10 -right-6 h-72 w-72 text-sun/25 sm:h-96 sm:w-96" aria-hidden>
          <path
            d="M100 200 C100 140 96 90 102 30 M102 60 C80 50 60 30 58 8 C82 18 98 38 102 60 M101 95 C125 80 150 70 172 72 C160 95 130 104 101 95 M100 130 C76 120 50 118 28 126 C46 144 78 146 100 130"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun">Gesucht. Gefunden. Verkräutert.</p>
            <h2 className="font-display text-5xl leading-[0.95] sm:text-7xl">
              <AccentTitle text={title || settings.ctaTitle || "Lust auf Wildkräuter?"} />
            </h2>
            {(text || settings.ctaText) && <p className="max-w-xl text-lg text-white/85">{text || settings.ctaText}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={href || "/kurse"} className="btn-light px-8 py-4 text-lg">
              {label || "Kurs buchen"} <span aria-hidden>↗</span>
            </Link>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn border border-white/70 text-white hover:bg-white/10">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type Testimonial = { _key: string; quote: string; name: string; context?: string | null };

/** Stimmen: grosse Zitate, abwechselnd links und rechts eingerückt */
export function Testimonials({ items }: { items?: Testimonial[] | null }) {
  if (!items?.length) return null;
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6">
      <p className="eyebrow">Stimmen aus den Kursen</p>
      <ul className="flex flex-col gap-14">
        {items.map((t, i) => (
          <li key={t._key} className={`reveal flex max-w-4xl flex-col gap-4 ${i % 2 ? "self-end text-right" : ""}`}>
            <blockquote className="font-display text-3xl leading-tight sm:text-5xl">
              <span className="text-accent">«</span>
              {t.quote}
              <span className="text-accent">»</span>
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              — {t.name}
              {t.context && ` · ${t.context}`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Bildreihe (2–3 Bilder), leicht verdreht wie eingeklebte Fotos */
export function ImageRow({ images }: { images?: (SanityImageType & { _key: string })[] | null }) {
  if (!images?.length) return null;
  const tilt = ["-rotate-2", "rotate-1", "-rotate-1"];
  return (
    <div className={`grid gap-6 ${images.length >= 3 ? "sm:grid-cols-3" : images.length === 2 ? "sm:grid-cols-2" : ""}`}>
      {images.map((image, i) => (
        <div key={image._key} className={`bg-white p-2.5 pb-8 shadow-lg ${tilt[i % 3]}`}>
          <div className={`relative overflow-hidden bg-line ${images.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
            <SanityImage image={image} alt="" sizes="(min-width: 640px) 33vw, 100vw" crop={{ width: 1200, height: 900 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
