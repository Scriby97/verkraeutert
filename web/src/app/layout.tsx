import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MaintenanceGate } from "@/components/MaintenanceGate";
import { buildNav, footerPages, isGroup } from "@/lib/nav";
import { getPages, getProducts, getSettings, imageUrl } from "@/lib/sanity";
import { siteUrl, underConstruction } from "@/lib/site";
import "./globals.css";

// Token aus Cloudflare → Web Analytics (öffentlich, steht ohnehin im HTML). Leer = keine Statistik.
// TODO nach dem Einrichten in Cloudflare eintragen. In den Tests (E2E=1) immer aus.
const analyticsToken = process.env.E2E === "1" ? "" : "";

// Design «Herbarium»: Fraunces (variabel, mit den Achsen SOFT und WONK für verspielte Kursive) für Titel,
// Manrope für Fliesstext, JetBrains Mono für die Etiketten wie auf Herbarbögen
const heading = Fraunces({ variable: "--font-heading", subsets: ["latin"], style: ["normal", "italic"], axes: ["SOFT", "WONK", "opsz"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"], weight: ["400", "500"] });


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.siteName ?? "Verkräutert";
  // Bild beim Teilen (WhatsApp, Facebook, …) vom Sanity-CDN: funktioniert auf jeder Adresse (auch workers.dev).
  // Ohne Bild im Studio: /og.jpg der Website
  const shareImage = underConstruction ? "/og-kurkuma.jpg" : (imageUrl(settings.shareImage, { width: 1200, height: 630 }) ?? "/og.jpg");
  return {
    title: { default: `${siteName} – Wildkräuterkurse im Aargau`, template: `%s | ${siteName}` },
    description: settings.heroText,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: "./" },
    openGraph: { images: [{ url: shareImage, width: 1200, height: 630, alt: siteName }], locale: "de_CH", siteName, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, pages, products] = await Promise.all([getSettings(), getPages(), getProducts()]);
  const nav = buildNav(pages);
  // Gleiche Auswahl wie der Warenkorb auf /warenkorb
  const orderableSlugs = products.filter((p) => p.available && !p.soldOut).map((p) => p.slug);
  const siteName = settings.siteName ?? "Verkräutert";
  const offerLinks = nav.filter(isGroup).find((g) => g.label === "Angebot")?.links ?? [];

  const page = (
    <>
      <a href="#inhalt" className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Zum Inhalt springen
      </a>
      <Header siteName={siteName} logo={settings.logo} nav={nav} orderableSlugs={orderableSlugs} />
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} offerLinks={offerLinks} moreLinks={footerPages(pages)} />
    </>
  );

  return (
    <html lang="de-CH" className={`${heading.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* Wartungsmodus aus dem Studio. Google wird bewusst nicht ausgesperrt: die Inhalte stehen weiter im HTML. */}
        {settings.maintenance ? (
          <MaintenanceGate
            siteName={siteName}
            text={settings.maintenanceText || "Hier wird gerade umgebaut – bald geht’s weiter!"}
            password={settings.previewPassword ?? undefined}
          >
            {page}
          </MaintenanceGate>
        ) : (
          page
        )}
        {analyticsToken && (
          // Cloudflare Web Analytics: ohne Cookies, zählt Seitenaufrufe
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: analyticsToken })} />
        )}
      </body>
    </html>
  );
}
