import type { Metadata } from "next";
import { AccentTitle, CtaBand, RotatingBadge } from "@/components/Blocks";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Jenny und Bettina von Verkräutert: seit 2021 gemeinsam unterwegs in der Welt der Wildkräuter – mit Wissen, Sicherheit, Genuss und Kreativität.",
  alternates: { canonical: "/ueber-uns" },
};

export default async function AboutPage() {
  const settings = await getSettings();
  const team = settings.team ?? [];

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden arch border border-ink bg-line">
            <SanityImage image={settings.aboutImage} alt="Jenny und Bettina" sizes="(min-width: 1024px) 50vw, 100vw" priority crop={{ width: 1200, height: 1500 }} />
          </div>
          <RotatingBadge text="Jenny · Bettina · seit 2021 · " className="absolute -bottom-6 -right-2 sm:-right-8" />
        </div>
        <div className="flex flex-col gap-6 lg:pt-8">
          <p className="eyebrow">Über uns</p>
          <h1 className="font-display text-5xl leading-[0.92] sm:text-7xl">
            <AccentTitle text={settings.aboutTitle ?? "Über uns"} />
          </h1>
          {settings.aboutLead && <p className="font-display text-xl italic leading-snug text-accent sm:text-2xl">{settings.aboutLead}</p>}
          <RichText value={settings.aboutText} className="text-lg leading-relaxed text-muted" />
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-plum text-white">
          <ul className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-2">
            {team.map((person, i) => (
              <li key={person._key} className={`reveal flex flex-col gap-5 rounded-[2rem] border border-white/20 p-6 sm:p-10 ${i % 2 ? "md:mt-16" : ""}`}>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-sun">Nr. {String(i + 1).padStart(2, "0")}</p>
                {person.image && (
                  <div className="relative aspect-square w-32 overflow-hidden rounded-full bg-line">
                    <SanityImage image={person.image} alt={person.name ?? ""} sizes="128px" crop={{ width: 400, height: 400 }} />
                  </div>
                )}
                <h2 className="font-display text-6xl italic text-sun sm:text-7xl">{person.name}</h2>
                {person.text && <RichText value={person.text} className="text-lg leading-relaxed text-white/85" />}
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaBand settings={settings} />
    </>
  );
}
