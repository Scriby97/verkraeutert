"use client";

import Link from "next/link";
import { useState } from "react";
import { herbById, herbs, type HerbId } from "@/lib/herbs";
import { HerbArt } from "./HerbArt";

// Kapitel III – «Verkräutert»: Drei Kräuter in den Kessel werfen, daraus entsteht ein Trank mit Namen,
// Farbe und einer Rezeptidee. Spielerisch, ohne Heilversprechen.
const MAX = 3;

function mix(colors: string[]) {
  if (!colors.length) return "#1f3a27";
  const rgb = colors.map((c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)));
  const avg = [0, 1, 2].map((k) => Math.round(rgb.reduce((s, c) => s + c[k], 0) / rgb.length));
  return `#${avg.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function recipeIdea(ids: HerbId[]) {
  if (ids.includes("baerlauch") || ids.includes("knoblauchsrauke")) return "ein grünes Wildkräuter-Pesto mit Nüssen und Olivenöl";
  if (ids.includes("brennnessel")) return "eine samtige Brennnesselsuppe mit Kartoffeln";
  if (ids.includes("loewenzahn")) return "ein bunter Frühlingssalat mit Löwenzahnblüten";
  if (ids.includes("giersch")) return "ein Flammkuchen mit Giersch";
  return "ein Kräuterquark für das nächste Picknick";
}

export function Cauldron() {
  const [inPot, setInPot] = useState<HerbId[]>([]);
  const full = inPot.length === MAX;
  const color = mix(inPot.map((id) => herbById[id].color));
  const potion = full ? `${herbById[inPot[0]].adjective} ${herbById[inPot[1]].noun}` : null;

  function toggle(id: HerbId) {
    setInPot((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX ? [...p, id] : p));
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      {/* Kessel */}
      <div className="relative mx-auto w-full max-w-md" aria-hidden>
        <div className="absolute inset-x-10 bottom-10 h-24 rounded-full blur-3xl transition-colors duration-700" style={{ background: color, opacity: inPot.length ? 0.55 : 0.15 }} />
        <svg viewBox="0 0 300 260" className="relative w-full">
          {/* Dampf und Blasen */}
          {inPot.length > 0 &&
            [70, 110, 150, 190, 230].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={110}
                r={6 + (i % 3) * 3}
                fill={color}
                className="bubble"
                style={{ ["--d" as string]: `${i * 0.45}s`, ["--bx" as string]: `${(i - 2) * 6}px` }}
                opacity={0.8}
              />
            ))}
          {/* Trank */}
          <ellipse cx="150" cy="112" rx="112" ry="22" fill={color} className="transition-[fill] duration-700" />
          {/* Kessel */}
          <path d="M34 110 C30 190 80 236 150 236 C220 236 270 190 266 110" fill="#0a120c" stroke="#e9c46a" strokeWidth={3} />
          <ellipse cx="150" cy="110" rx="118" ry="26" fill="none" stroke="#e9c46a" strokeWidth={4} />
          <path d="M70 236 L58 256 M230 236 L242 256" stroke="#e9c46a" strokeWidth={5} strokeLinecap="round" />
          {/* Flammen */}
          {[110, 150, 190].map((x, i) => (
            <path key={x} d={`M${x} 258 C${x - 14} 246 ${x - 4} 236 ${x} 226 C${x + 4} 236 ${x + 14} 246 ${x} 258Z`} fill={i === 1 ? "#f6dc95" : "#e9c46a"} className="float" />
          ))}
          {/* Kräuter im Kessel */}
          {inPot.map((id, i) => (
            <g key={id} transform={`translate(${92 + i * 44} 44)`} className="text-ink">
              <HerbArt id={id} width={46} height={56} />
            </g>
          ))}
        </svg>
      </div>

      {/* Auswahl und Ergebnis */}
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-muted">
            Wähle drei Kräuter für deinen Trank ({inPot.length} von {MAX}):
          </legend>
          <div className="flex flex-wrap gap-2">
            {herbs.map((h) => {
              const active = inPot.includes(h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggle(h.id)}
                  aria-pressed={active}
                  disabled={!active && full}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-4 text-sm font-semibold transition disabled:opacity-40 ${
                    active ? "border-sun bg-sun text-plum shadow-[0_0_24px_-6px_rgba(185,245,108,0.9)]" : "border-line bg-moss text-ink hover:border-accent"
                  }`}
                >
                  <span className="w-6">
                    <HerbArt id={h.id} className="h-auto w-full" />
                  </span>
                  {h.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="min-h-44 rounded-[1.75rem] border border-line bg-moss p-6" aria-live="polite">
          {potion ? (
            <div className="flex flex-col gap-3">
              <p className="eyebrow">Dein Trank ist fertig</p>
              <p className="glow font-display text-4xl italic text-accent">{potion}</p>
              <p className="text-ink/90">
                Aus {inPot.map((id) => herbById[id].name).join(", ")} wird in der echten Küche zum Beispiel {recipeIdea(inPot)}. Wie das
                geht – und wie du die Kräuter sicher sammelst – lernst du bei uns.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/kurse" className="btn-primary">
                  Expedition buchen
                </Link>
                <button type="button" onClick={() => setInPot([])} className="btn-outline">
                  Neu brauen
                </button>
              </div>
            </div>
          ) : (
            <p className="font-display text-2xl italic text-muted">
              {inPot.length === 0 ? "Der Kessel brodelt leise und wartet auf Zutaten …" : "Es blubbert! Noch " + (MAX - inPot.length) + " Kraut" + (MAX - inPot.length > 1 ? "er" : "") + " …"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
