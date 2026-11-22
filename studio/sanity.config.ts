import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

// Sanity-Projekt «Verkräutert» – Project-ID nach dem Anlegen hier und in sanity.cli.ts eintragen
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'TODO'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// Einstellungen gibt es genau einmal – kein "Neu erstellen"/"Löschen" dafür
const singletonTypes = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Verkräutert',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhalte')
          .items([
            S.listItem()
              .title('Website-Einstellungen')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('post').title('Blog'),
            S.documentTypeListItem('product').title('Kurse & Shop'),
            S.divider(),
            S.documentTypeListItem('page').title('Weitere Seiten'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
