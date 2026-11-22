import {defineField, defineType} from 'sanity'
import {altText} from './altText'

// Angebot unter «Kurse & Shop»: Kurs mit festen Daten (Anmeldung mit Platzzahl), Kurs nach Absprache,
// Produkt (Versand oder Abholung am Kurs) oder Gutschein. Bezahlt wird per TWINT oder Überweisung.
export const product = defineType({
  name: 'product',
  title: 'Kurs / Shop-Angebot',
  type: 'document',
  groups: [
    {name: 'main', title: 'Angebot', default: true},
    {name: 'event', title: 'Kursdaten'},
    {name: 'order', title: 'Bestellung'},
  ],
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Kurzname (für Links)',
      type: 'slug',
      group: 'main',
      options: {source: 'name', maxLength: 64},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Art',
      type: 'string',
      group: 'main',
      options: {
        list: [
          {title: 'Kurs mit festen Daten (Anmeldung, Plätze werden gezählt)', value: 'event'},
          {title: 'Kurs nach Absprache (z. B. privater Kräuterspaziergang)', value: 'course'},
          {title: 'Produkt (Versand oder Abholung am Kurs)', value: 'item'},
          {title: 'Gutschein', value: 'voucher'},
        ],
        layout: 'radio',
      },
      initialValue: 'event',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preis (CHF)',
      type: 'number',
      group: 'main',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'priceNote',
      title: 'Zusatz zum Preis',
      description: 'z. B. «pro Person», «3 Kurstage» oder «250 ml».',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      description: 'Ein bis zwei Sätze – erscheint im Shop unter dem Angebot.',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'details',
      title: 'Ausführliche Beschreibung',
      description: 'Ablauf, was inbegriffen ist, was man mitbringt usw. – erscheint auf der Seite des Angebots.',
      type: 'richText',
      group: 'main',
    }),
    defineField({
      name: 'images',
      title: 'Bilder',
      description: 'Das erste Bild wird als Hauptbild angezeigt.',
      type: 'array',
      group: 'main',
      of: [{type: 'image', options: {hotspot: true}, fields: [altText]}],
    }),

    defineField({
      name: 'date',
      title: 'Datum (erster Kurstag)',
      description: 'Bis zu diesem Tag kann man sich anmelden; danach verschwindet der Kurs automatisch aus der Übersicht.',
      type: 'date',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
      validation: (r) =>
        r.custom((date, {document}) => (document?.kind === 'event' && !date ? 'Bitte ein Datum eintragen.' : true)),
    }),
    defineField({
      name: 'time',
      title: 'Zeit',
      description: 'z. B. «18 bis 20 Uhr». Bei mehreren Kurstagen unten die einzelnen Daten eintragen.',
      type: 'string',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
    }),
    defineField({
      name: 'schedule',
      title: 'Alle Kurstage',
      description:
        'Nur bei Kursen mit mehreren Tagen, je eine Zeile, z. B. «Do, 11. März 2027, 17.30–19.00 Uhr, Frick». Leer = nur das Datum oben.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      description: 'z. B. «Frick AG, 5 Minuten vom Bahnhof, Parkplätze vorhanden».',
      type: 'string',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event' && document?.kind !== 'course',
    }),
    defineField({
      name: 'seats',
      title: 'Freie Plätze',
      description:
        'Wird bei jeder Buchung automatisch heruntergezählt. Bei 0 steht «Ausgebucht». Leer lassen, wenn die Plätze nicht gezählt werden sollen.',
      type: 'number',
      group: 'event',
      hidden: ({document}) => document?.kind !== 'event',
      validation: (r) => r.min(0).integer(),
    }),

    defineField({
      name: 'giftFields',
      title: 'Felder für Gutscheine',
      description: 'Beim Bestellen kann man den Namen der beschenkten Person und einen Grusstext für den Gutschein angeben.',
      type: 'boolean',
      initialValue: true,
      group: 'order',
      hidden: ({document}) => document?.kind !== 'voucher',
    }),
    defineField({
      name: 'available',
      title: 'Im Shop bestellbar',
      description: 'Ausschalten, um das Angebot vorübergehend auszublenden.',
      type: 'boolean',
      initialValue: true,
      group: 'order',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Reihenfolge',
      description: 'Kleinere Zahl = weiter vorne. Kurse mit festen Daten stehen immer nach Datum sortiert zuoberst.',
      type: 'number',
      initialValue: 10,
      group: 'order',
    }),
  ],
  orderings: [{title: 'Reihenfolge', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', price: 'price', media: 'images.0', available: 'available', kind: 'kind', date: 'date'},
    prepare: ({title, price, media, available, kind, date}) => ({
      title,
      subtitle: [
        ({voucher: 'Gutschein', course: 'Kurs nach Absprache', event: 'Kurs', item: 'Produkt'} as Record<string, string>)[kind],
        kind === 'event' && date && new Date(date).toLocaleDateString('de-CH'),
        `CHF ${price ?? '–'}`,
        available === false && 'ausgeblendet',
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
