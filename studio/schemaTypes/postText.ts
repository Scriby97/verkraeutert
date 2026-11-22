import {defineArrayMember, defineField, defineType} from 'sanity'
import {altText} from './altText'
import {richText} from './richText'

// Text eines Blogartikels: wie «Text», zusätzlich Bilder zwischen den Absätzen (Knopf «+» in der Werkzeugleiste)
export const postText = defineType({
  name: 'postText',
  title: 'Artikeltext',
  type: 'array',
  of: [
    ...richText.of,
    defineArrayMember({
      type: 'image',
      title: 'Bild',
      options: {hotspot: true},
      fields: [altText, defineField({name: 'caption', title: 'Bildunterschrift (freiwillig)', type: 'string'})],
    }),
  ],
})
