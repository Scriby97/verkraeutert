// Phase «im Aufbau»: Die Seite läuft als Vorschau auf workers.dev (Konto Kurcom), verkraeutert.ch zeigt noch auf Wix.
// Beim Teilen erscheint überall das Logo mit dem gelben Kurkuma-Stempel (public/og-kurkuma.jpg).
// Beim Umzug der Domain: underConstruction auf false – dann gelten verkraeutert.ch und die eigenen Bilder
// von Blogartikeln, Kursen und aus dem Studio.
export const underConstruction = true;

// Hauptadresse der Website (Google, Sitemap, Teilen)
export const siteUrl = underConstruction ? "https://verkraeutert.kurcom.workers.dev" : "https://verkraeutert.ch";
