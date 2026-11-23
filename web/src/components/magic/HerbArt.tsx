import type { HerbId } from "@/lib/herbs";

// Gezeichnete Kräuter (Linien wie im Logo). Farbe über currentColor, Blüten in eigener Farbe.
export function HerbArt({ id, className = "", width, height }: { id: HerbId; className?: string; width?: number; height?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 120" className={className} width={width} height={height} aria-hidden>
      {id === "baerlauch" && (
        <g {...common}>
          <path d="M50 118 C48 90 36 60 22 30 C40 44 50 70 50 118" />
          <path d="M50 118 C54 88 66 56 82 26 C62 42 52 72 50 118" />
          <path d="M50 118 L50 34" />
          <g fill="#f3f0e2" stroke="none">
            {[[50, 26], [44, 30], [56, 30], [47, 22], [53, 22], [50, 32]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={2.6} />
            ))}
          </g>
        </g>
      )}
      {id === "brennnessel" && (
        <g {...common}>
          <path d="M50 118 L50 14" />
          {[30, 58, 86].map((y, i) => (
            <g key={i}>
              <path d={`M50 ${y} C40 ${y - 6} 28 ${y - 4} 22 ${y + 6} l5 -1 -2 5 5 -1 -2 5 5 0 C38 ${y + 14} 46 ${y + 8} 50 ${y}`} />
              <path d={`M50 ${y} C60 ${y - 6} 72 ${y - 4} 78 ${y + 6} l-5 -1 2 5 -5 -1 2 5 -5 0 C62 ${y + 14} 54 ${y + 8} 50 ${y}`} />
            </g>
          ))}
        </g>
      )}
      {id === "giersch" && (
        <g {...common}>
          <path d="M50 118 L50 52 M50 52 L28 30 M50 52 L72 30 M50 52 L50 22" />
          <path d="M28 30 C16 28 12 16 20 10 C30 10 34 20 28 30Z" />
          <path d="M72 30 C84 28 88 16 80 10 C70 10 66 20 72 30Z" />
          <path d="M50 22 C42 18 42 6 50 2 C58 6 58 18 50 22Z" />
          <path d="M50 80 L30 70 M30 70 C20 72 14 62 20 56 C28 56 32 62 30 70Z" />
        </g>
      )}
      {id === "spitzwegerich" && (
        <g {...common}>
          <path d="M50 118 C44 90 30 70 18 52 C34 60 46 84 50 118" />
          <path d="M50 118 C56 90 70 70 82 52 C66 60 54 84 50 118" />
          <path d="M50 118 C48 92 44 74 40 56 M50 118 C52 92 56 74 60 56" />
          <path d="M50 118 C50 80 52 50 54 24" />
          <ellipse cx="55" cy="16" rx="4.5" ry="9" fill="currentColor" fillOpacity={0.35} />
          <g fill="#f3f0e2" stroke="none">
            {[8, 12, 16, 20, 24].map((y) => (
              <circle key={y} cx={y % 8 ? 50 : 60} cy={y} r={1.4} />
            ))}
          </g>
        </g>
      )}
      {id === "loewenzahn" && (
        <g {...common}>
          <path d="M50 118 L50 44" />
          <path d="M50 118 C40 108 30 108 16 100 l8 -4 -10 -6 10 -2 -8 -8 C34 86 44 98 50 118" />
          <path d="M50 118 C60 108 70 108 84 100 l-8 -4 10 -6 -10 -2 8 -8 C66 86 56 98 50 118" />
          <circle cx="50" cy="32" r="12" fill="#e8c22e" stroke="#e8c22e" />
          <g stroke="#f6dc95" strokeWidth={1.6}>
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <path key={i} d={`M${50 + Math.cos(a) * 13} ${32 + Math.sin(a) * 13} L${50 + Math.cos(a) * 19} ${32 + Math.sin(a) * 19}`} />;
            })}
          </g>
        </g>
      )}
      {id === "knoblauchsrauke" && (
        <g {...common}>
          <path d="M50 118 L50 20" />
          <path d="M50 92 C38 76 18 84 24 100 C30 112 46 104 50 92Z" />
          <path d="M50 64 C62 48 82 56 76 72 C70 84 54 76 50 64Z" />
          <path d="M50 40 C42 30 30 36 34 46 C38 54 48 50 50 40Z" />
          <g fill="#f3f0e2" stroke="none">
            {[[50, 14], [44, 18], [56, 18]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x - 2} cy={y} r={2} />
                <circle cx={x + 2} cy={y} r={2} />
                <circle cx={x} cy={y - 2} r={2} />
                <circle cx={x} cy={y + 2} r={2} />
              </g>
            ))}
          </g>
        </g>
      )}
      {id === "gundermann" && (
        <g {...common}>
          <path d="M6 100 C30 96 50 104 94 92" />
          {[[22, 92], [50, 96], [76, 90]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y} L${x} ${y - 26}`} />
              <path d={`M${x} ${y - 26} c-8 -2 -12 -10 -8 -16 c6 -4 12 0 8 16 c4 -16 10 -20 16 -16 c4 6 0 14 -8 16`} />
              <path d={`M${x} ${y - 10} c-10 0 -16 -6 -14 -12 c6 -2 12 2 14 12`} />
            </g>
          ))}
          <g fill="#9a7bd1" stroke="none">
            <ellipse cx="50" cy="60" rx="3" ry="5" />
            <ellipse cx="22" cy="56" rx="3" ry="5" />
            <ellipse cx="76" cy="54" rx="3" ry="5" />
          </g>
        </g>
      )}
    </svg>
  );
}
