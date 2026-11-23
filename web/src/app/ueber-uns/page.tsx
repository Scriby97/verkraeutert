import type { Metadata } from "next";
import { CtaBand } from "@/components/Blocks";
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-line">
          <SanityImage image={settings.aboutImage} alt="Jenny und Bettina" sizes="(min-width: 1024px) 50vw, 100vw" priority crop={{ width: 1200, height: 1500 }} />
        </div>
        <div className="flex flex-col gap-6 lg:pt-8">
          <p className="eyebrow">Über uns</p>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{settings.aboutTitle ?? "Über uns"}</h1>
          {settings.aboutLead && <p className="font-display text-xl font-medium text-accent sm:text-2xl">{settings.aboutLead}</p>}
          <RichText value={settings.aboutText} className="text-lg leading-relaxed text-muted" />
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-moss">
          <ul className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
            {team.map((person) => (
              <li key={person._key} className="flex flex-col gap-5 rounded-3xl bg-blush p-6 sm:p-8">
                {person.image && (
                  <div className="relative aspect-square w-32 overflow-hidden rounded-full bg-line">
                    <SanityImage image={person.image} alt={person.name ?? ""} sizes="128px" crop={{ width: 400, height: 400 }} />
                  </div>
                )}
                <h2 className="font-display text-3xl font-semibold">{person.name}</h2>
                {person.text && <RichText value={person.text} className="text-lg leading-relaxed text-muted" />}
              </li>
            ))}
          </ul>
        </section>
      )}
      <CtaBand settings={settings} />
    </>
  );
}
