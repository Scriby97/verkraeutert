# Verkräutert

Neue Website für Verkräutert (Jenny Hanses und Bettina Pfiffner, Wildkräuterkurse in Frick und Othmarsingen AG) –
Nachfolgerin der Wix-Seite verkraeutert.ch. Gleiche Infrastruktur wie Veganrocks, evi’s universum und
Pirouettentraum: statisch gebaut mit Next.js, Inhalte in Sanity, Anmeldungen und Anfragen per Formular (Web3Forms),
gehostet als Cloudflare Worker. Aufgebaut auf dem Code von Veganrocks (Shop, Platzzahl, TWINT).

- `web/` – die Website (Next.js, statischer Export nach `web/out`)
- `studio/` – Sanity Studio, in dem Jenny und Bettina Blog, Kurse, Shop und Texte pflegen
- `material/` – alte Seite (nicht im Repo): `alte-seite/` Texte und Blogartikel als Text, `bilder/` eigene Bilder
  von Wix (`9b489c_…`; die Wix-Stockbilder `11062b_…` werden nicht verwendet)

## Inhalte

- **Blog:** Artikel mit Titelbild, Autorin, Kategorie (Wissen, Rezepte, Tipps), Bildern im Text und «Passende
  Kurse» am Schluss. Kategorien haben eigene Seiten, dazu ein RSS-Feed (`/blog/feed.xml`).
- **Kurse & Shop:** Kurse mit festen Daten (mehrere Kurstage, Platzzahl wird nach jeder Anmeldung vom Worker
  heruntergezählt, `/api/seats`), Kurse nach Absprache, Produkte (Abholung am Kurs oder Versand mit Pauschale)
  und Gutscheine. Kurse verschwinden nach dem ersten Kurstag beim nächsten Build.
- **Bezahlen:** TWINT (QR-Code nach dem Absenden) oder Überweisung (IBAN und Bestellnummer nach dem Absenden;
  ohne IBAN im Studio folgt eine Rechnung). Keine Online-Zahlung – die Anmeldung geht per Web3Forms als Mail.
- **Website-Einstellungen:** Startseite, Über uns (Jenny & Bettina), Blog-Texte, Kurse & Bezahlung, Stimmen,
  Kontakt & Rechtliches, Wartungsmodus.
- **Weitere Seiten:** optional, z. B. «Kräuterspaziergänge» – erscheinen im Menü unter «Angebot».

## SEO – was gegenüber der Wix-Seite besser ist

Die Wix-Seite war auf **allen Seiten mit `noindex`** für Google gesperrt, hatte keine Sitemap (404) und einen
kaputten Menülink (`/kräuterkurse`). Neu: Sitemap und robots.txt, saubere Adressen ohne Umlaute, strukturierte
Daten (Organisation, Kurse als Event mit Datum und Preis, Blogartikel mit Autorin und Datum), Kategorie-Seiten,
RSS-Feed, Bild beim Teilen pro Artikel/Kurs. Alte Adressen leitet der Worker um (`/post/…` → `/blog/…`,
`/über-uns`, `/kräuterkurse`, `/product-page/…`, `/blog-feed.xml`, `www` → ohne www).

## Lokal starten

```bash
cd web && npm install && npm run dev      # http://localhost:3000
cd studio && npm install && npm run dev   # http://localhost:3333
```

Ohne `web/.env.local` zeigt die Website die Inhalte der alten Seite (`web/src/lib/placeholder.ts`, Blogartikel in
`placeholder-posts.json`) mit den Bildern aus `web/public/preview` (nicht im Repo; Kopie aus `material/bilder`).

Tests: `cd web && npm run test:e2e` (feste Testdaten aus `src/lib/e2e-fixtures.ts`, fängt Formulare ab, prüft
Anmeldung, Bezahlung, Versand, Blog, Sitemap und Barrierefreiheit).

## Einrichtung (offen)

1. **Sanity-Projekt** anlegen (vorher `npx sanity debug`: mit welchem Konto?), Project ID in
   `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `web/wrangler.jsonc` und `web/.env.local` eintragen.
2. **Startinhalt** übertragen: `cd studio && npx sanity exec scripts/seed.ts --with-user-token`
   (6 Blogartikel, Saisonkurs, Einstellungen, Bilder; Wartungsmodus an, Passwort «kraut»). Überschreibt nichts.
3. **Studio** veröffentlichen: `cd studio && npm run deploy` → https://verkraeutert.sanity.studio, Jenny und
   Bettina im **Projekt** einladen (nicht in der Organisation).
4. **Web3Forms:** Formular für die Mailadresse von Verkräutert anlegen, Key als Build-Variable
   `NEXT_PUBLIC_WEB3FORMS_KEY`.
5. **Cloudflare:** Worker aus dem GitHub-Repo bauen lassen (Root `web`, Build `npm run build`, Deploy
   `npx wrangler deploy`), Build-Variablen `NEXT_PUBLIC_*`, Secret `SANITY_WRITE_TOKEN` (Platzzahl),
   Deploy-Hook als Sanity-Webhook. Build-Benachrichtigung: Queue `verkraeutert-builds` anlegen, dann in
   `wrangler.jsonc` einschalten, Secrets `NTFY_TOPIC`/`NTFY_TOKEN`.
6. **Domain:** verkraeutert.ch von Wix zu Cloudflare (Nameserver), E-Mail-Einträge vorher prüfen.

## Noch zu klären mit Jenny und Bettina

- Bilder: Titelbilder und Fotos fürs Team; die Wix-Stockbilder sind ersetzt, eigene Fotos fehlen noch zum Teil.
- E-Mail-Adresse: auf der alten Seite steht «info@verkräutert.ch» (mit Umlaut) – richtige Adresse bestätigen.
- AGB: auf der alten Seite nur ein Vorlagentext – eigene AGB (Annullation, Wetter, Haftung) nötig?
- Kundenstimme «Katharina Schulz» der alten Seite stammt vermutlich aus der Wix-Vorlage – nicht übernommen.
- TWINT-QR-Code, IBAN, Versandkosten, Platzzahl des Saisonkurses, zweiter Kursort Othmarsingen.
- Newsletter (Wix-Anmeldung im Footer) – weiterführen? Dann Anbieter-Link im Studio.
