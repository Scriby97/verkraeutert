import {defineField, defineType} from 'sanity'
import {altText} from './altText'

export const postCategories = [
  {title: 'Wissen', value: 'wissen'},
  {title: 'Rezepte', value: 'rezepte'},
  {title: 'Tipps', value: 'tipps'},
]

// Blogartikel – Herzstück der Website: gut für Google, verlinkt auf passende Kurse
export const post = defineType({
  name: 'post',
  title: 'Blogartikel',
  type: 'document',
  groups: [
    {name: 'main', title: 'Artikel', default: true},
    {name: 'settings', title: 'Einstellungen & Google'},
  ],
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', group: 'main', validation: (r) => r.required().max(110)}),
    defineField({
      name: 'slug',
      title: 'Adresse (für Links)',
      description: 'Auf «Generate» klicken. Später nicht mehr ändern, sonst funktionieren geteilte Links nicht mehr.',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      description: 'Ein bis zwei Sätze. Erscheint in der Übersicht und bei Google unter dem Titel (höchstens 160 Zeichen).',
      type: 'text',
      rows: 3,
      group: 'main',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'coverImage',
      title: 'Titelbild',
      description: 'Querformat wirkt am schönsten. Erscheint in der Übersicht, oben im Artikel und beim Teilen.',
      type: 'image',
      options: {hotspot: true},
      fields: [altText],
      group: 'main',
    }),
    defineField({name: 'body', title: 'Text', type: 'postText', group: 'main'}),

    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autorin',
      type: 'string',
      options: {list: ['Bettina', 'Jenny', 'Jenny & Bettina'], layout: 'radio'},
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {list: postCategories, layout: 'radio'},
      initialValue: 'wissen',
      group: 'settings',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'relatedCourses',
      title: 'Passende Kurse',
      description: 'Erscheinen am Ende des Artikels als Empfehlung. Leer = die nächsten Kurse.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: (r) => r.max(3),
      group: 'settings',
    }),
  ],
  orderings: [{title: 'Neueste zuerst', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'publishedAt', author: 'author', media: 'coverImage', category: 'category'},
    prepare: ({title, date, author, media, category}) => ({
      title,
      subtitle: [
        date && new Date(date).toLocaleDateString('de-CH'),
        author,
        postCategories.find((c) => c.value === category)?.title,
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
