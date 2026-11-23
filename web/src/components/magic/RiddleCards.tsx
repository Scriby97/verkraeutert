"use client";

import { useState } from "react";
import { herbs, type HerbId } from "@/lib/herbs";
import { HerbArt } from "./HerbArt";

// Kapitel II – «Gefunden»: Wer bin ich? Ein Klick dreht die Karte um: Name, Verwendung, Verwechslungsgefahr.
const chosen: HerbId[] = ["baerlauch", "giersch", "spitzwegerich", "brennnessel"];

export function RiddleCards() {
  const [flipped, setFlipped] = useState<HerbId[]>([]);
  const toggle = (id: HerbId) => setFlipped((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {herbs
          .filter((h) => chosen.includes(h.id))
          .map((herb, i) => {
            const isFlipped = flipped.includes(herb.id);
            return (
              <li key={herb.id} className="reveal flip-card h-[26rem]" data-flipped={isFlipped}>
                <button
                  type="button"
                  onClick={() => toggle(herb.id)}
                  aria-pressed={isFlipped}
                  aria-label={isFlipped ? `${herb.name} – Karte zurückdrehen` : `Rätsel ${i + 1} auflösen`}
                  className="flip-inner relative block size-full rounded-[1.75rem] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {/* Vorderseite: Rätsel */}
                  <span
                    className="flip-face absolute inset-0 flex flex-col justify-between gap-4 overflow-hidden rounded-[1.75rem] border border-accent/40 bg-[radial-gradient(circle_at_50%_30%,#1f3a27,#0e1a12)] p-6"
                    aria-hidden={isFlipped}
                  >
                    <span className="eyebrow">Rätsel {i + 1} · Wer bin ich?</span>
                    <span className="float mx-auto block w-28 text-leaf/60 blur-[1.5px]">
                      <HerbArt id={herb.id} className="h-auto w-full" />
                    </span>
                    <span className="font-display text-xl italic leading-snug text-ink">«{herb.riddle}»</span>
                    <span className="text-sm font-semibold text-accent">Antwort aufdecken ↻</span>
                  </span>
                  {/* Rückseite: Steckbrief */}
                  <span
                    className="flip-face flip-back absolute inset-0 flex flex-col gap-3 overflow-y-auto rounded-[1.75rem] border border-sun/50 bg-moss p-6 shadow-[0_0_50px_-12px_rgba(185,245,108,0.5)]"
                    aria-hidden={!isFlipped}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-12 shrink-0 text-sun">
                        <HerbArt id={herb.id} className="h-auto w-full" />
                      </span>
                      <span>
                        <span className="glow-green block font-display text-3xl text-sun">{herb.name}</span>
                        <span className="block text-xs italic text-muted">{herb.latin}</span>
                      </span>
                    </span>
                    <span className="text-sm text-ink">
                      <strong className="text-accent">In der Küche:</strong> {herb.use}
                    </span>
                    <span className="text-sm text-ink">
                      <strong className="text-accent">Achtung:</strong> {herb.caution}
                    </span>
                    <span className="mt-auto text-xs uppercase tracking-[0.2em] text-muted">Saison: {herb.season}</span>
                  </span>
                </button>
              </li>
            );
          })}
      </ul>
      <p className="text-sm text-muted" aria-live="polite">
        {flipped.length === chosen.length
          ? "Alle Rätsel gelöst! Draussen ist Bestimmen viel kniffliger – genau das üben wir im Kurs."
          : `${flipped.length} von ${chosen.length} Rätseln gelöst.`}
      </p>
    </div>
  );
}
