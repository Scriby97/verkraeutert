import Image from "next/image";
import Link from "next/link";
import { isGroup, type NavItem } from "@/lib/nav";
import { imageUrl, type SanityImage } from "@/lib/sanity";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";

// Schwebende Leiste wie ein Etikett, das oben am Bogen klebt
export function Header({
  siteName,
  logo,
  nav,
  orderableSlugs,
}: {
  siteName: string;
  logo?: SanityImage | null;
  nav: NavItem[];
  /** Angebote, die man bestellen kann – für die Zahl am Warenkorb-Symbol */
  orderableSlugs: string[];
}) {
  const logoSrc = imageUrl(logo);
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 print:hidden sm:px-5">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-x-6 rounded-full border border-ink/15 bg-cream/85 py-1.5 pl-2 pr-2 shadow-[0_10px_30px_-18px_rgba(22,32,26,0.5)] backdrop-blur-md sm:pl-3">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${siteName} – zur Startseite`}>
          {logoSrc ? (
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white/70">
              <Image src={logoSrc} alt="" width={48} height={44} className="h-10 w-auto" priority />
            </span>
          ) : null}
          <span className="font-display text-2xl italic leading-none text-ink">{siteName.toLowerCase()}</span>
        </Link>

        <nav aria-label="Hauptmenü" className="hidden items-center gap-x-1 lg:flex">
          {nav.map((item) =>
            isGroup(item) ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-cream"
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg viewBox="0 0 20 20" className="size-3.5 transition group-hover:rotate-180" aria-hidden>
                    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-60 rounded-3xl border border-ink/15 bg-cream p-2 shadow-xl">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block rounded-2xl px-4 py-2.5 text-ink hover:bg-sun">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-cream"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <CartButton orderableSlugs={orderableSlugs} />
          <Link href="/kurse" className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Kurs buchen <span aria-hidden>↗</span>
          </Link>
          <MobileMenu nav={nav} />
        </div>
      </div>
    </header>
  );
}
