"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { herbs, type Herb, type HerbId } from "@/lib/herbs";
import { HerbArt } from "./HerbArt";

// Kapitel I – «Gesucht»: Mit der Laterne (Maus oder Finger) durch den dunklen Wald leuchten und die
// versteckten Kräuter finden. Jedes gefundene Kraut leuchtet weiter und landet im Korb.
// Tastatur: Tab springt von Kraut zu Kraut, das Licht folgt dem Fokus. «Laterne ganz aufdrehen» erhellt alles.
//
// Aufbau in drei Zeilen, damit nichts die Kräuter überdeckt: Titel – Waldboden mit den Kräutern – Korb.
// Dunkelheit und Glühwürmchen liegen über der ganzen Fläche (ohne Klicks abzufangen); Titel und Korb liegen
// darüber, gefundene Kräuter auch.

// Verstecke auf dem Waldboden in Prozent (links, oben), Grösse in Pixeln
const spots: Record<HerbId, { x: number; y: number; size: number; rotate: number }> = {
  baerlauch: { x: 8, y: 42, size: 92, rotate: -8 },
  brennnessel: { x: 23, y: 70, size: 82, rotate: 6 },
  giersch: { x: 39, y: 38, size: 76, rotate: -4 },
  spitzwegerich: { x: 54, y: 72, size: 88, rotate: 4 },
  loewenzahn: { x: 69, y: 40, size: 80, rotate: -6 },
  knoblauchsrauke: { x: 83, y: 70, size: 82, rotate: 8 },
  gundermann: { x: 94, y: 34, size: 68, rotate: -3 },
};

// Glühwürmchen und Sterne: feste Werte, damit Server und Browser dasselbe zeichnen
const fireflies = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: 15 + ((i * 53) % 80),
  dx: ((i * 29) % 80) - 40,
  dy: -20 - ((i * 17) % 50),
  t: 6 + (i % 7),
  d: (i * 0.7) % 9,
}));
const stars = Array.from({ length: 40 }, (_, i) => ({ left: (i * 61 + 7) % 100, top: (i * 23) % 40, d: (i * 0.37) % 3, s: 1 + (i % 3) }));

export function ForestQuest({ children }: { children: ReactNode }) {
  const area = useRef<HTMLElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState<HerbId[]>([]);
  const [last, setLast] = useState<Herb | null>(null);
  const [lantern, setLantern] = useState(false);
  const [moved, setMoved] = useState(false);
  const done = found.length === herbs.length;

  const moveLight = useCallback((clientX: number, clientY: number) => {
    const el = area.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${clientX - r.left}px`);
    el.style.setProperty("--y", `${clientY - r.top}px`);
  }, []);

  // Startposition der Laterne: links auf dem Waldboden
  useEffect(() => {
    const f = floor.current?.getBoundingClientRect();
    if (f) moveLight(f.left + f.width * 0.3, f.top + f.height * 0.5);
  }, [moveLight]);

  function find(herb: Herb) {
    setLast(herb);
    setFound((f) => (f.includes(herb.id) ? f : [...f, herb.id]));
  }

  return (
    <section
      ref={area}
      id="kapitel-1"
      aria-labelledby="wald-titel"
      onPointerMove={(e) => {
        moveLight(e.clientX, e.clientY);
        if (!moved) setMoved(true);
      }}
      onPointerDown={(e) => moveLight(e.clientX, e.clientY)}
      className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#1d3a26_0%,#0c1610_55%,#060d08_100%)] select-none"
      style={{ ["--x" as string]: "30%", ["--y" as string]: "70%" }}
    >
      {/* Sterne, Mond, Bäume */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-[#f6eccb]"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
          />
        ))}
        <div className="absolute right-[10%] top-[8%] size-24 rounded-full bg-[#f6eccb] opacity-90 shadow-[0_0_80px_20px_rgba(246,236,203,0.25)] sm:size-32" />
        <svg viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[75%] w-full text-[#0a140d]">
          {[
            [40, 120, 260],
            [150, 60, 330],
            [300, 140, 230],
            [880, 90, 300],
            [1010, 40, 360],
            [1130, 120, 260],
          ].map(([x, top, w], i) => (
            <path key={i} fill="currentColor" d={`M${x} ${top} L${x - w / 4} 500 L${x + w / 4} 500 Z`} opacity={0.95} />
          ))}
          <path fill="#081109" d="M0 330 C200 300 330 350 520 320 C700 292 900 350 1200 310 L1200 500 L0 500 Z" />
        </svg>
      </div>

      {/* Titel */}
      <div className="relative z-40 mx-auto flex max-w-7xl flex-col gap-5 px-4 pt-10 sm:px-6 sm:pt-12">
        <p className="eyebrow">Kapitel I · Gesucht</p>
        {children}
      </div>

      {/* Waldboden mit den versteckten Kräutern (ohne eigene Ebene, damit gefundene Kräuter über die Dunkelheit kommen) */}
      <div ref={floor} className="relative mx-auto mt-2 h-64 max-w-7xl sm:h-72">
        {herbs.map((herb) => {
          const spot = spots[herb.id];
          const isFound = found.includes(herb.id);
          return (
            <button
              key={herb.id}
              type="button"
              onClick={() => find(herb)}
              onFocus={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                moveLight(r.left + r.width / 2, r.top + r.height / 2);
              }}
              aria-label={isFound ? `${herb.name} – gefunden` : "Verstecktes Kraut"}
              aria-pressed={isFound}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 transition focus-visible:outline-2 focus-visible:outline-accent ${
                isFound ? "just-found z-30 text-sun drop-shadow-[0_0_14px_rgba(185,245,108,0.85)]" : "z-0 text-leaf hover:text-sun"
              }`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `clamp(48px, 7vw, ${spot.size}px)`, rotate: `${spot.rotate}deg` }}
            >
              <HerbArt id={herb.id} className="h-auto w-full" />
              {isFound && (
                <span className="pointer-events-none absolute inset-0" aria-hidden>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <span
                      key={k}
                      className="sparkle absolute left-1/2 top-1/2 size-2 rounded-full bg-accent"
                      style={{ ["--sx" as string]: `${(k - 2) * 22}px`, ["--sy" as string]: `${-40 - (k % 3) * 16}px` }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Korb und Hinweis */}
      <div className="relative z-40 mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-8 sm:px-6">
        <p className="max-w-xl text-ink/85" aria-live="polite">
          {last ? (
            <>
              <strong className="font-display text-2xl text-sun">{last.name} gefunden!</strong> {last.found}
            </>
          ) : moved ? (
            "Weiter so – leuchte über den Waldboden."
          ) : (
            "Bewege die Maus oder deinen Finger durch den dunklen Wald und finde die sieben versteckten Kräuter."
          )}
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-[2rem] border border-line bg-plum/85 py-2 pl-4 pr-2 backdrop-blur">
          <span className="font-display text-lg italic text-ink">
            Dein Kräuterkorb: <span className="text-sun">{found.length}</span> von {herbs.length}
          </span>
          <ul className="flex flex-wrap gap-1.5" aria-label="Gefundene Kräuter">
            {herbs.map((h) => {
              const has = found.includes(h.id);
              return (
                <li
                  key={h.id}
                  title={has ? h.name : "noch nicht gefunden"}
                  className={`flex size-9 items-center justify-center rounded-full border ${has ? "border-sun/70 bg-sun/15 text-sun" : "border-line text-[#3c5544]"}`}
                >
                  <HerbArt id={h.id} className="h-7 w-6" />
                  <span className="sr-only">{has ? h.name : "noch nicht gefunden"}</span>
                </li>
              );
            })}
          </ul>
          {!done && (
            <button
              type="button"
              onClick={() => setLantern((l) => !l)}
              aria-pressed={lantern}
              className="ml-auto rounded-full border border-accent/60 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-plum"
            >
              {lantern ? "Laterne dimmen" : "Laterne ganz aufdrehen"}
            </button>
          )}
        </div>
      </div>

      {/* Dunkelheit mit Lichtkegel der Laterne */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ${lantern || done ? "opacity-25" : "opacity-100"}`}
        style={{
          background: "radial-gradient(circle 190px at var(--x) var(--y), rgba(6,13,8,0) 0%, rgba(6,13,8,0.2) 45%, rgba(6,13,8,0.93) 100%)",
        }}
        aria-hidden
      />
      {/* Laterne am Mauszeiger */}
      <div
        className="pointer-events-none absolute z-30 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_40px_14px_rgba(233,196,106,0.55)]"
        style={{ left: "var(--x)", top: "var(--y)" }}
        aria-hidden
      />
      {/* Glühwürmchen */}
      <div className="pointer-events-none absolute inset-0 z-30" aria-hidden>
        {fireflies.map((f, i) => (
          <span
            key={i}
            className="firefly"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              ["--dx" as string]: `${f.dx}px`,
              ["--dy" as string]: `${f.dy}px`,
              ["--t" as string]: `${f.t}s`,
              ["--d" as string]: `${f.d}s`,
            }}
          />
        ))}
      </div>

      {/* Belohnung */}
      {done && (
        <div className="absolute inset-x-4 top-1/2 z-50 mx-auto max-w-xl -translate-y-1/2 rounded-[2rem] border border-accent/50 bg-plum/95 p-8 text-center shadow-[0_0_80px_-10px_rgba(233,196,106,0.6)] backdrop-blur sm:p-10">
          <p className="eyebrow">Kapitel I geschafft</p>
          <p className="glow mt-3 font-display text-4xl italic text-accent sm:text-5xl">Gesucht. Gefunden. Verkräutert!</p>
          <p className="mt-4 text-lg text-ink/90">
            Du hast alle sieben Kräuter gefunden. Draussen im Wald ist es nicht ganz so einfach – darum zeigen wir dir im Kurs, wie du sie
            sicher erkennst.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/kurse" className="btn-primary">
              Zur nächsten Expedition
            </Link>
            <a href="#kapitel-2" className="btn-outline">
              Weiter zu Kapitel II
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
