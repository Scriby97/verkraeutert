import type { Page, Post, Product, SiteSettings } from "./sanity";
import oldPosts from "./placeholder-posts.json";

// Inhalte der bisherigen Wix-Seite (verkraeutert.ch, Stand November 2026), aufgeteilt auf die neue Struktur.
// Sie erscheinen, solange keine Sanity-Project-ID gesetzt ist, und sind der Startinhalt für das Studio
// (studio/scripts/seed.ts). Bilder «image-local-…» liegen in public/preview (nicht im Repo, Kopie aus
// material/bilder) und werden beim Seed nach Sanity hochgeladen.
// Texte: «## » = Zwischentitel, «- » = Aufzählung, Leerzeile = neuer Absatz.

let keyCount = 0;
const key = () => `p${(keyCount++).toString(36)}`;

export const img = (file: string, alt: string) => ({
  _type: "image" as const,
  _key: key(),
  asset: { _type: "reference" as const, _ref: `image-local-${file}` },
  alt,
});

const items = <T extends object>(list: T[]) => list.map((item) => ({ ...item, _key: key() }));

export const placeholderSettings: SiteSettings = {
  maintenance: false,
  maintenanceText: "Hier entsteht die neue Website von Verkräutert – bald geht’s los!",
  siteName: "Verkräutert",
  logo: img("logo.png", "Verkräutert"),
  heroEyebrow: "Verkräutert – deine Wildkräuterkurse in der Natur",
  heroTitle: "Entdecke die Welt der Wildkräuter",
  heroText:
    "Lerne in unseren Wildkräuterkursen, wie du essbare Wildkräuter und Heilpflanzen sicher erkennst, nachhaltig sammelst und genussvoll verarbeitest – direkt vor deiner Haustür.",
  heroImage: img("kraeuterteller.jpg", "Frisch gesammelte Wildkräuter und Blüten auf einem runden Metalltablett"),
  heroFacts: items([
    { value: "seit 2021", label: "gemeinsam im Kräuterwissen unterwegs" },
    { value: "Frick & Othmarsingen", label: "Kurse im Aargau, nahe Bahnhof" },
    { value: "ohne Vorwissen", label: "für Einsteigerinnen und Einsteiger" },
  ]),
  introTitle: "Gesucht. Gefunden. Verkräutert.",
  introText:
    "Entdecke essbare Wildkräuter mit Verkräutert! Lerne in unseren Wildkräuterkursen, wie du Heilpflanzen erkennst, sammelst und anwendest – direkt vor deiner Haustür.\n\nWir zeigen dir, wie du Wildkräuter sicher bestimmst, dein Wissen Schritt für Schritt aufbaust und sie schmackhaft zubereitest. Dabei sprechen wir offen darüber, worauf zu achten ist und welche Gefahren bestehen können – und teilen vor allem unsere Freude und Passion.",
  introImage: img("jenny-bettina-ernte.jpg", "Jenny und Bettina mit frisch gesammelten Brennnesseln in der Küche"),
  ctaTitle: "Lust auf Wildkräuter?",
  ctaText: "Melde dich für den nächsten Kurs an oder schreib uns – wir freuen uns auf dich.",

  aboutTitle: "Wir sind Jenny und Bettina – und wir lieben Wildkräuter.",
  aboutLead:
    "Seit 2021 setzen wir uns gemeinsam intensiv mit der Welt der Wildkräuter auseinander. Wir schreiben Kräuterporträts, tüfteln in der Küche an Heilmitteln und Gerichten, experimentieren, lernen und vertiefen unser Wissen stetig.",
  aboutText:
    "Uns begeistert alles, was es über Wildkräuter zu wissen gibt – von der sicheren Bestimmung bis zur genussvollen Verarbeitung.\n\nKomm mit auf die Reise, wenn es heisst: Gesucht, Gefunden, Verkräutert. Wir zeigen dir, wie du Wildkräuter erkennst, dein Wissen Schritt für Schritt aufbaust, sie richtig verarbeitest und schmackhaft zubereitest. Dabei sprechen wir offen darüber, worauf zu achten ist, welche Gefahren bestehen können – und vor allem teilen wir unsere Freude, unsere Erfahrung und unsere Passion.\n\nGemeinsam verbinden wir Wissen, Sicherheit, Genuss und Kreativität – und genau das möchten wir bei Verkräutert mit dir teilen.",
  aboutImage: img("jenny-bettina-kueche.jpg", "Jenny und Bettina mit Wildkräutern in der Küche"),
  team: items([
    {
      name: "Jenny",
      text: "Jenny ist gelernte Pflegefachfrau, lebt in Bern, ist verheiratet und teilt ihr Zuhause mit zwei Katzen und fünf Hühnern. Sie liebt es, Oxymel herzustellen – vom Ansatz bis zum Honig, der dafür sogar selbst produziert wird.\n\nIhr grösstes Anliegen ist die Sicherheit in der Anwendung von Wildkräutern. Sorgfalt, Wissen und Verantwortung stehen für sie immer an erster Stelle.",
    },
    {
      name: "Bettina",
      text: "Bettina ist gelernte PR-Fachfrau und Gründerin der Kochschule Veganrocks, mit der sie seit 2011 Menschen für eine gesunde, pflanzliche Küche begeistert. Sie lebt mit ihrem Freund und zwei Hunden im Fricktal, ist am liebsten draussen in der Natur und kocht fürs Leben gern mit Wildkräutern.\n\nIhr Fachgebiet ist Genuss, Kreativität und alltagstaugliche Küche – Wildkräuter dürfen dabei nicht nur gesund, sondern vor allem richtig lecker sein.",
    },
  ]),

  blogTitle: "Verkräuterte News",
  blogIntro: "Kräuterporträts, Rezepte und Tipps zum Sammeln – aus unserer Küche und von unseren Streifzügen durch Wald und Wiese.",

  shopIntro:
    "Unsere Kurse finden in Frick und Othmarsingen AG statt, jeweils in kurzer Gehdistanz zum Bahnhof und mit Parkplätzen. Du brauchst kein Vorwissen – nur Neugier und Freude an der Natur.",
  orderInfo:
    "## So funktioniert die Anmeldung\n- Kurs in den Warenkorb legen und Anmeldung absenden\n- Bezahlen per TWINT direkt nach der Anmeldung oder per Überweisung\n- Du erhältst eine Bestätigung mit allen Angaben; vor dem Kurs melden wir uns mit den Details zum Treffpunkt",

  ownerName: "Jenny Hanses und Bettina Pfiffner",
  address: "Bettina Pfiffner\nSteinacker 2\n5073 Gipf-Oberfrick",
  email: "info@verkräutert.ch",
  instagram: "https://www.instagram.com/verkraeutert/",
  tiktok: "https://www.tiktok.com/@verkraeutert",
};

export const placeholderPages: Page[] = [];

export const placeholderProducts: Product[] = [
  {
    _id: "product-saisonkurs",
    name: "Der Wildkräuter-Saisonkurs – 3 Kurstage",
    slug: "wildkraeuter-saisonkurs",
    kind: "event",
    price: 290,
    priceNote: "3 Kurstage, alles inklusive",
    description:
      "Mit Jenny und Bettina durch die Saison: Wildkräuter sicher bestimmen, nachhaltig sammeln und genussvoll verarbeiten – ohne Vorwissen.",
    details:
      "Tauche ein in die faszinierende Welt der Wildkräuter und lerne, dich sicher, achtsam und mit Freude in Wald und Wiese zu bewegen. In unserem Saisonkurs begleiten wir dich Schritt für Schritt auf deinem Weg zu fundiertem Kräuterwissen – praxisnah, verständlich und mit viel Herzblut.\n\n## Für wen\nDer Kurs richtet sich an Anfängerinnen und Anfänger, die:\n- Wildkräuter kennenlernen möchten\n- sie sicher bestimmen wollen\n- lernen möchten, wie man sie sinnvoll, genussvoll und nachhaltig verwendet\n\nDu brauchst kein Vorwissen – nur Neugier, Freude an der Natur und Lust, Neues zu entdecken.\n\n## Was dich erwartet\n- Gemeinsames Kräutersammeln in der Natur\n- Sicheres Bestimmen von Wildkräutern\n- Grundlagen zu nachhaltigem Sammeln\n- Trocknen und Lagern von Kräutern\n- Verarbeitung zu einfachen Heilmitteln wie Oxymel, Teemischungen und Tinkturen\n- Kochen und Zubereiten mit Wildkräutern\n- Viele praktische Tipps für den Alltag\n- Gemütliche Teemomente in der Runde\n- Dein persönliches Kräuterbuch zum Mitnehmen\n\nDu lernst die Wildkräuter und ihre Veränderung durch die Saison kennen – das ist ganz elementar für die Bestimmung. Ein echtes Rundum-Paket, nach dem du dich sicher fühlst im Umgang mit Wildkräutern und mit einem geschärften Blick durch Wald und Wiese gehst.\n\n## Im Preis inbegriffen\nKurs, Materialien, Kräuterbuch, Tee, Häppchen – und viel Wissen, Praxis und Inspiration.",
    images: [
      img("jenny-bettina-kueche.jpg", "Jenny und Bettina mit Wildkräutern in der Küche"),
      img("kraeuterteller.jpg", "Frisch gesammelte Wildkräuter und Blüten auf einem runden Metalltablett"),
      img("baerlauch.jpg", "Bärlauchblätter im Wald"),
      img("kraeuterpasta.jpg", "Pasta mit Wildkräutern und Tomaten auf einem weissen Teller"),
    ],
    date: "2027-03-11",
    time: "17.30 bis 19.00 Uhr (1. Kurstag), danach 18 bis 20 Uhr",
    schedule: [
      "Donnerstag, 11. März 2027, 17.30–19.00 Uhr, Frick AG",
      "Donnerstag, 22. April 2027, 18.00–20.00 Uhr, Frick AG",
      "Donnerstag, 10. Juni 2027, 18.00–20.00 Uhr, Frick AG",
    ],
    location: "Frick AG – kurze Gehdistanz vom Bahnhof, Parkplätze vorhanden",
    seats: null,
    giftFields: false,
    soldOut: false,
    available: true,
  },
];

// Blogartikel der alten Seite (Texte unverändert, Titelbilder in public/preview)
export const placeholderPosts: Post[] = oldPosts
  .map((p) => ({
    _id: `post-${p.slug}`,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.cover ? img(p.cover, p.title) : null,
    body: p.body,
    publishedAt: p.publishedAt,
    author: p.author as Post["author"],
    category: p.category as Post["category"],
    relatedCourses: ["wildkraeuter-saisonkurs"],
  }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
