import Link from "next/link";
import type { NavLink } from "@/lib/nav";
import type { SiteSettings } from "@/lib/sanity";

// Fusszeile: Waldgrün, Spalten wie ein Inhaltsverzeichnis, unten der Name riesig über die ganze Breite
export function Footer({ settings, offerLinks, moreLinks }: { settings: SiteSettings; offerLinks: NavLink[]; moreLinks: NavLink[] }) {
  const siteName = settings.siteName ?? "Verkräutert";
  const socials = [
    settings.instagram && { href: settings.instagram, label: "Instagram" },
    settings.tiktok && { href: settings.tiktok, label: "TikTok" },
    settings.facebook && { href: settings.facebook, label: "Facebook" },
    settings.whatsapp && { href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp" },
  ].filter(Boolean) as NavLink[];
  const legal: NavLink[] = [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    ...(settings.agbText ? [{ href: "/agb", label: "AGB" }] : []),
  ];

  return (
    <footer className="overflow-hidden bg-plum text-white/80 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <p className="font-display text-3xl italic leading-tight text-white">Gesucht. Gefunden. Verkräutert.</p>
          <p className="text-sm">Wildkräuterkurse mit Jenny und Bettina in Frick und Othmarsingen AG.</p>
          {settings.newsletterUrl && (
            <a href={settings.newsletterUrl} target="_blank" rel="noreferrer" className="font-semibold text-sun hover:text-white">
              Newsletter mit neuen Kursen & Kräutertipps →
            </a>
          )}
        </div>

        <FooterList title="Kurse & Angebot" links={[{ href: "/kurse", label: "Kurse & Shop" }, ...offerLinks]} />
        <FooterList title="Mehr" links={[{ href: "/blog", label: "Blog" }, { href: "/ueber-uns", label: "Über uns" }, ...moreLinks]} />

        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-sun">Kontakt</h2>
          {settings.ownerName && <p>{settings.ownerName}</p>}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="hover:text-white">
              {settings.email}
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
              {settings.phone}
            </a>
          )}
          {socials.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full border border-white/30 px-3 py-1.5 text-sm hover:border-sun hover:bg-sun hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Riesiger Name über die ganze Breite */}
      <p className="select-none whitespace-nowrap px-2 text-center font-display text-[19vw] italic leading-[0.8] text-sun/90" aria-hidden>
        {siteName.toLowerCase()}
      </p>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* Seit 2021; das aktuelle Jahr kommt vom letzten Build (jede Änderung im Studio baut neu) */}
          <p>
            © 2021–{new Date().getFullYear()} {siteName}
          </p>
          <nav aria-label="Rechtliches" className="flex gap-5">
            {legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-sun">{title}</h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-display text-xl italic text-white hover:text-sun">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
