import { expect, test } from "@playwright/test";
import { addProduct, cartCount, fillCustomer, mockServices } from "./helpers";

test("Kursseite zeigt Kurse, Kurse nach Absprache, Shop und Gutscheine", async ({ page }) => {
  await mockServices(page);
  await page.goto("/kurse");
  for (const name of ["Kurse", "Kurse nach Absprache", "Shop", "Gutscheine"]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(page.getByText("Ausgebucht", { exact: true })).toBeVisible();
});

test("Kurs mit mehreren Kurstagen: Daten sichtbar, Kursdaten für Google", async ({ page }) => {
  await mockServices(page);
  await page.goto("/kurse/test-kurs");
  await expect(page.getByText("Do, 11. März 2099, 18–20 Uhr")).toBeVisible();
  await expect(page.getByText("Do, 22. April 2099, 18–20 Uhr")).toBeVisible();
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(ld).toMatchObject({ "@type": "Event", name: "Testkurs", startDate: "2099-03-11", offers: { price: "290.00", priceCurrency: "CHF" } });
});

test("Anmeldung mit Überweisung: IBAN und Bestellnummer, Platzabzug", async ({ page }) => {
  const { forms, seats } = await mockServices(page);
  // 3 freie Plätze → höchstens 3 wählbar
  await page.goto("/kurse/test-kurs");
  await expect(page.locator("form#auswahl").getByRole("option")).toHaveCount(3);
  await addProduct(page, "test-kurs", { quantity: 2 });
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (2)");
  await page.goto("/warenkorb");
  // Im Warenkorb bis 3 erhöhbar, danach gesperrt
  await page.getByRole("button", { name: "Testkurs: eins mehr" }).click();
  await expect(page.getByRole("button", { name: "Testkurs: eins mehr" })).toBeDisabled();
  await fillCustomer(page);
  await page.getByLabel(/Überweisung/).check();
  await page.getByRole("button", { name: "Verbindlich anmelden" }).click();
  await expect(page.getByRole("heading", { name: /Vielen Dank für deine Anmeldung/ })).toBeVisible();

  const mail = forms[0];
  expect(mail.subject).toMatch(/^Neue Anmeldung\/Bestellung VK-\d{6}-\d{4} von Test Kunde$/);
  expect(mail.Zahlungsart).toMatch(/^Überweisung mit Bestellnummer/);
  expect(mail.Bestellung).toContain("3 × Testkurs à CHF 290.00");
  expect(mail.Total).toBe("CHF 870.00");
  // Bankangaben in der Bestätigung
  await expect(page.getByText("CH93 0076 2011 6238 5295 7", { exact: true })).toBeVisible();
  // Bestellnummer als Mitteilung für die Überweisung
  await expect(page.getByRole("definition").filter({ hasText: mail.Bestellnummer as string })).toBeVisible();
  await expect.poll(() => seats.length).toBe(1);
  expect(seats[0].items).toEqual([{ slug: "test-kurs", quantity: 3 }]);
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (0)");
});

test("Produkt mit Versand: Versandkosten im Total, Adresse ist Pflicht, Bezahlung per TWINT", async ({ page }) => {
  const { forms, seats } = await mockServices(page);
  await addProduct(page, "test-oxymel", { quantity: 2 });
  await page.goto("/warenkorb");
  await expect(page.getByText("CHF 36.00")).toBeVisible();
  await page.getByLabel(/Versand per Post/).check();
  await expect(page.getByText("CHF 45.00")).toBeVisible();
  await fillCustomer(page);
  await expect(page.getByLabel("Adresse für den Versand")).toHaveAttribute("required", "");
  await page.getByLabel("Adresse für den Versand").fill("Kräuterweg 1\n5070 Frick");
  await page.getByLabel(/TWINT – direkt/).check();
  await page.getByRole("button", { name: "Verbindlich anmelden" }).click();
  await expect(page.getByRole("img", { name: /TWINT-QR-Code/ })).toBeVisible();
  await expect(page.locator("ol")).toContainText("CHF 45.00");
  expect(forms[0].Bestellung).toContain("Versand per Post: CHF 9.00");
  expect(forms[0].Adresse).toBe("Kräuterweg 1\n5070 Frick");
  expect(forms[0].Zahlungsart).toMatch(/^TWINT/);
  // Produkte haben keine Platzzahl
  expect(seats).toHaveLength(0);
});

test("Gutschein mit Grusstext", async ({ page }) => {
  const { forms } = await mockServices(page);
  await addProduct(page, "test-gutschein", { recipient: "Lena", greeting: "Alles Gute!" });
  await page.goto("/warenkorb");
  await fillCustomer(page);
  await page.getByRole("button", { name: "Verbindlich anmelden" }).click();
  await expect(page.getByRole("heading", { name: /Vielen Dank/ })).toBeVisible();
  expect(forms[0].Bestellung).toContain("Für: Lena");
  expect(forms[0].Bestellung).toContain("Grusstext: «Alles Gute!»");
});

test("Ausgebuchter Kurs lässt sich nicht in den Warenkorb legen", async ({ page }) => {
  await mockServices(page);
  await page.goto("/kurse/test-ausgebucht");
  await expect(page.getByRole("link", { name: "Auf die Warteliste" })).toBeVisible();
  await expect(page.getByRole("button", { name: "In den Warenkorb" })).toHaveCount(0);
});

test("Fehler beim Senden: Meldung, Warenkorb bleibt", async ({ page }) => {
  const { seats } = await mockServices(page, { formsFail: true });
  await addProduct(page, "test-spaziergang");
  await page.goto("/warenkorb");
  await fillCustomer(page);
  await page.getByRole("button", { name: "Verbindlich anmelden" }).click();
  await expect(page.getByText("Die Anmeldung konnte nicht gesendet werden")).toBeVisible();
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (1)");
  expect(seats).toHaveLength(0);
});
