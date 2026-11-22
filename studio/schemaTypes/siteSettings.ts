import {defineArrayMember, defineField, defineType} from 'sanity'
import {altText} from './altText'
import {facts} from './facts'

const image = (name: string, title: string, group: string, description?: string) =>
  defineField({name, title, description, type: 'image', options: {hotspot: true}, fields: [altText], group})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  groups: [
    {name: 'launch', title: 'Wartung'},
    {name: 'home', title: 'Startseite', default: true},
    {name: 'about', title: 'Über uns'},
    {name: 'blog', title: 'Blog'},
    {name: 'shop', title: 'Kurse & Bezahlung'},
    {name: 'voices', title: 'Stimmen'},
    {name: 'legal', title: 'Kontakt & Rechtliches'},
  ],
  fields: [
    defineField({
      name: 'maintenance',
      title: 'Website vorübergehend sperren (Wartungsmodus)',
      description:
        'Eingeschaltet: Besucherinnen und Besucher sehen nur die Wartungsseite mit eurem Text. Mit dem Passwort kommt ihr trotzdem auf die Website und könnt Änderungen prüfen. Danach ausschalten und Publish – nach 3–5 Minuten ist die Seite wieder für alle offen.',
      type: 'boolean',
      initialValue: false,
      group: 'launch',
    }),
    defineField({name: 'maintenanceText', title: 'Text auf der Wartungsseite', type: 'text', rows: 3, group: 'launch'}),
    defineField({
      name: 'previewPassword',
      title: 'Passwort, um trotzdem auf die Website zu kommen',
      description: 'Solange der Wartungsmodus an ist. Gross-/Kleinschreibung egal.',
      type: 'string',
      group: 'launch',
      validation: (r) =>
        r.custom((pw, {document}) =>
          document?.maintenance && !pw ? 'Bitte ein Passwort eintragen, sonst kommt ihr selbst nicht mehr auf die Seite.' : true,
        ),
    }),

    defineField({name: 'siteName', title: 'Name der Website', type: 'string', group: 'home'}),
    defineField({name: 'logo', title: 'Logo', description: 'PNG oder SVG mit transparentem Hintergrund.', type: 'image', group: 'home'}),
    defineField({
      name: 'shareImage',
      title: 'Bild beim Teilen',
      description:
        'Erscheint, wenn jemand die Website z. B. per WhatsApp teilt. Querformat 1200 × 630 Pixel, unter 300 KB. Blogartikel und Kurse zeigen stattdessen ihr eigenes Bild.',
      type: 'image',
      group: 'home',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Kleine Überzeile',
      description: 'z. B. «Verkräutert – deine Wildkräuterkurse in der Natur».',
      type: 'string',
      group: 'home',
    }),
    defineField({name: 'heroTitle', title: 'Grosser Titel', type: 'string', group: 'home'}),
    defineField({
      name: 'heroText',
      title: 'Text unter dem Titel',
      description: 'Erscheint auch bei Google unter dem Seitentitel – ein bis zwei Sätze.',
      type: 'text',
      rows: 3,
      group: 'home',
    }),
    image('heroImage', 'Titelbild', 'home', 'Gross im Hintergrund, eher dunkel wirkt am besten (der Titel steht in Weiss darauf).'),
    facts('heroFacts', 'Eckdaten unter dem Titelbild', 'home'),
    defineField({name: 'introTitle', title: 'Titel Vorstellung', type: 'string', group: 'home'}),
    defineField({name: 'introText', title: 'Text Vorstellung', type: 'richText', group: 'home'}),
    image('introImage', 'Bild Vorstellung', 'home'),
    defineField({
      name: 'ctaTitle',
      title: 'Titel im farbigen Block am Schluss',
      description: 'Erscheint auf der Startseite und auf allen Seiten ohne eigenen Aufruf.',
      type: 'string',
      group: 'home',
    }),
    defineField({name: 'ctaText', title: 'Text im farbigen Block', type: 'text', rows: 2, group: 'home'}),

    defineField({name: 'aboutTitle', title: 'Titel', type: 'string', group: 'about'}),
    defineField({name: 'aboutLead', title: 'Einleitung', type: 'text', rows: 3, group: 'about'}),
    defineField({name: 'aboutText', title: 'Text', type: 'richText', group: 'about'}),
    image('aboutImage', 'Bild', 'about', 'Am schönsten ein gemeinsames Foto.'),
    defineField({
      name: 'team',
      title: 'Wir',
      type: 'array',
      group: 'about',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 6}),
            defineField({name: 'image', title: 'Foto', type: 'image', options: {hotspot: true}, fields: [altText]}),
          ],
          preview: {select: {title: 'name', subtitle: 'text', media: 'image'}},
        }),
      ],
    }),

    defineField({name: 'blogTitle', title: 'Titel der Blog-Seite', type: 'string', group: 'blog'}),
    defineField({name: 'blogIntro', title: 'Einleitung', type: 'text', rows: 3, group: 'blog'}),

    defineField({name: 'shopIntro', title: 'Einleitung auf der Kursseite', type: 'text', rows: 3, group: 'shop'}),
    defineField({
      name: 'orderInfo',
      title: 'So funktioniert die Anmeldung',
      description: 'Erscheint unten auf der Kursseite und im Warenkorb.',
      type: 'richText',
      group: 'shop',
    }),
    defineField({
      name: 'twintQr',
      title: 'TWINT-QR-Code',
      description: 'Ist er hinterlegt, kann man bei der Anmeldung «TWINT» wählen und gleich bezahlen.',
      type: 'image',
      group: 'shop',
    }),
    defineField({
      name: 'bankAccount',
      title: 'Bankverbindung für Überweisung',
      description: 'Erscheint nach der Anmeldung zusammen mit der Bestellnummer. Leer = Rechnung folgt per E-Mail.',
      type: 'object',
      group: 'shop',
      fields: [
        defineField({name: 'holder', title: 'Kontoinhaberin', description: 'z. B. «Verkräutert, Bettina Pfiffner, 5073 Gipf-Oberfrick».', type: 'string'}),
        defineField({name: 'iban', title: 'IBAN', type: 'string', validation: (r) => r.regex(/^CH\d{2}[ 0-9A-Z]{15,30}$/i, {name: 'IBAN'})}),
      ],
    }),
    defineField({
      name: 'shippingFee',
      title: 'Versandkosten für Produkte (CHF)',
      description: 'Pauschal pro Bestellung. Leer = Produkte nur zur Abholung am Kurs.',
      type: 'number',
      group: 'shop',
      validation: (r) => r.min(0),
    }),

    defineField({
      name: 'testimonials',
      title: 'Stimmen von Teilnehmenden',
      description: 'Nur echte Rückmeldungen, am besten mit Einverständnis der Person.',
      type: 'array',
      group: 'voices',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'quote', title: 'Zitat', type: 'text', rows: 4, validation: (r) => r.required()}),
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'context', title: 'Kurs', description: 'z. B. «Saisonkurs 2026».', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'quote'}},
        }),
      ],
    }),

    defineField({name: 'ownerName', title: 'Verantwortlich (Namen)', description: 'z. B. «Jenny Hanses und Bettina Pfiffner».', type: 'string', group: 'legal'}),
    defineField({name: 'company', title: 'Firma', description: 'Wie im Handelsregister, falls eingetragen.', type: 'string', group: 'legal'}),
    defineField({name: 'address', title: 'Adresse', type: 'text', rows: 3, group: 'legal'}),
    defineField({name: 'email', title: 'E-Mail', type: 'string', group: 'legal'}),
    defineField({name: 'phone', title: 'Telefon', description: 'Optional – erscheint auf der Kontaktseite.', type: 'string', group: 'legal'}),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp-Nummer',
      description: 'Optional, mit Ländervorwahl, z. B. 41791234567 (ohne + und Leerzeichen).',
      type: 'string',
      group: 'legal',
      validation: (r) => r.regex(/^\d{8,15}$/, {name: 'Nummer'}),
    }),
    defineField({name: 'instagram', title: 'Instagram-Link', type: 'url', group: 'legal'}),
    defineField({name: 'tiktok', title: 'TikTok-Link', type: 'url', group: 'legal'}),
    defineField({name: 'facebook', title: 'Facebook-Link', type: 'url', group: 'legal'}),
    defineField({
      name: 'newsletterUrl',
      title: 'Newsletter-Anmeldung (Link)',
      description: 'Link zur Anmeldung, z. B. von Mailchimp oder Brevo. Leer = kein Newsletter-Hinweis.',
      type: 'url',
      group: 'legal',
    }),
    defineField({
      name: 'agbText',
      title: 'AGB',
      description: 'Leer lassen = keine AGB-Seite. Zwischentitel mit «Gross» formatieren.',
      type: 'richText',
      group: 'legal',
    }),
    defineField({
      name: 'privacyText',
      title: 'Datenschutzerklärung',
      description:
        'Leer = Standardtext der Website. Der Abschnitt «Verantwortliche Stelle» entsteht automatisch aus Namen, Adresse und E-Mail.',
      type: 'richText',
      group: 'legal',
    }),
  ],
  preview: {prepare: () => ({title: 'Website-Einstellungen'})},
})
