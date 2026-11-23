import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { siteUrl } from "../src/lib/site";
import { addProduct, mockServices } from "./helpers";

// Barrierefreiheit (WCAG 2.1 AA) der wichtigsten Seiten
const pages = [
  "/",
  "/kraeuterspaziergaenge",
  "/kurse",
  "/kurse/test-kurs",
  "/kurse/test-oxymel",
  "/blog",
  "/blog/kategorie/rezepte",
  "/blog/knoblauchsrauke-im-test",
  "/blog/sammeln-im-test",
  "/ueber-uns",
  "/kontakt",
  "/datenschutz",
];

for (const path of pages) {
  test(`Barrierefreiheit ${path}`, async ({ page }) => {
    await mockServices(page);
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });
}

test("Barrierefreiheit Warenkorb", async ({ page }) => {
  await mockServices(page);
  await addProduct(page, "test-oxymel");
  await page.goto("/warenkorb");
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test("Menü führt zu Kursen, Blog und Seiten aus dem Studio", async ({ page, isMobile }) => {
  await mockServices(page);
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    await page.getByRole("navigation", { name: "Menü" }).getByRole("link", { name: "Kräuterspaziergänge" }).click();
  } else {
    await page.getByRole("navigation", { name: "Hauptmenü" }).getByRole("button", { name: "Angebot" }).hover();
    await page.getByRole("navigation", { name: "Hauptmenü" }).getByRole("link", { name: "Kräuterspaziergänge" }).click();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Kräuterspaziergänge" })).toBeVisible();
  await expect(page.getByText("Toller Kurs!")).toBeVisible(); // Stimmen eingeschaltet
});

test("Startseite zeigt die nächsten Kurse und die neuesten Blogartikel", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Testkurs/ }).first()).toHaveAttribute("href", "/kurse/test-kurs");
  await expect(page.getByRole("link", { name: /Knoblauchsrauke im Test/ })).toHaveAttribute("href", "/blog/knoblauchsrauke-im-test");
  // Firmenangaben für Google
  expect(await page.locator('script[type="application/ld+json"]').first().textContent()).toContain('"@type":"Organization"');
});

test("Blog: Kategorien, Artikel mit Bild im Text und passendem Kurs", async ({ page }) => {
  await mockServices(page);
  await page.goto("/blog");
  await page.getByRole("link", { name: "Tipps", exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/kategorie\/tipps$/);
  await expect(page.getByRole("link", { name: /Sammeln im Test/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Knoblauchsrauke im Test/ })).toHaveCount(0);

  await page.getByRole("link", { name: /Sammeln im Test/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Sammeln im Test" })).toBeVisible();
  await expect(page.getByText("von Jenny")).toBeVisible();
  await expect(page.getByRole("img", { name: "Bild im Artikel" })).toBeVisible();
  await expect(page.getByText("Bildunterschrift im Test")).toBeVisible();

  await page.goto("/blog/knoblauchsrauke-im-test");
  // Gewählter Kurs am Schluss
  await expect(page.getByRole("heading", { name: "Lust, das selbst zu lernen?" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Testkurs/ })).toHaveAttribute("href", "/kurse/test-kurs");
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(ld).toMatchObject({ "@type": "BlogPosting", headline: "Knoblauchsrauke im Test", author: { name: "Bettina" }, datePublished: "2099-02-20" });
});

test("RSS-Feed, Sitemap und robots.txt für Google", async ({ request }) => {
  const feed = await (await request.get("/blog/feed.xml")).text();
  expect(feed).toContain("<title>Knoblauchsrauke im Test</title>");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/kurse/test-kurs", "/blog/sammeln-im-test", "/blog/kategorie/rezepte", "/ueber-uns"]) {
    expect(sitemap).toContain(`${siteUrl}${path}`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).not.toMatch(/Disallow: \/\s*$/m);
});

test("Kontaktanfrage geht mit Anliegen an Verkräutert", async ({ page }) => {
  const { forms } = await mockServices(page);
  await page.goto("/kontakt");
  await page.getByLabel("Name", { exact: true }).fill("Test Verein");
  await page.getByLabel("E-Mail", { exact: true }).fill("verein@example.ch");
  await page.getByLabel("Anlass").selectOption("Kurs für eine Gruppe");
  await page.getByLabel("Nachricht").fill("Wir möchten einen Kräuterspaziergang.");
  await page.getByRole("button", { name: "Anfrage senden" }).click();
  await expect(page.getByRole("heading", { name: "Danke für deine Anfrage!" })).toBeVisible();
  expect(forms[0]).toMatchObject({ subject: "Anfrage Kurs für eine Gruppe von Test Verein", Anlass: "Kurs für eine Gruppe" });
});

test("Abenteuer auf der Startseite: Kräuter finden, Rätsel lösen, Trank brauen", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  const forest = page.locator("#kapitel-1");
  // Mit der Tastatur: Fokus auf ein verstecktes Kraut, Enter sammelt es ein
  const hidden = forest.getByRole("button", { name: "Verstecktes Kraut" });
  await expect(hidden).toHaveCount(7);
  await hidden.first().focus();
  await page.keyboard.press("Enter");
  await expect(forest.getByText("Dein Kräuterkorb: 1 von 7")).toBeVisible();
  while ((await hidden.count()) > 0) await hidden.first().click();
  await expect(forest.getByText("Gesucht. Gefunden. Verkräutert!")).toBeVisible();
  await expect(forest.getByRole("link", { name: "Zur nächsten Expedition" })).toHaveAttribute("href", "/kurse");

  // Rätselkarte umdrehen: Name und Warnhinweis erscheinen
  const riddles = page.locator("#kapitel-2");
  await riddles.getByRole("button", { name: "Rätsel 1 auflösen" }).click();
  await expect(riddles.getByRole("button", { name: "Bärlauch – Karte zurückdrehen" })).toHaveAttribute("aria-pressed", "true");

  // Drei Kräuter in den Kessel: Trank mit Namen, dann ist die Auswahl voll
  const cauldron = page.locator("#kapitel-3");
  for (const name of ["Bärlauch", "Giersch", "Löwenzahn"]) await cauldron.getByRole("button", { name }).click();
  await expect(cauldron.getByText("Wilder Gartengeist")).toBeVisible();
  await expect(cauldron.getByRole("button", { name: "Brennnessel" })).toBeDisabled();
  await cauldron.getByRole("button", { name: "Neu brauen" }).click();
  await expect(cauldron.getByText("Der Kessel brodelt leise")).toBeVisible();
});
