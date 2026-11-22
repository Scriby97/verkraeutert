import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '9jcv5tis',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio ist nach `npm run deploy` unter https://verkraeutert.sanity.studio erreichbar
  studioHost: 'verkraeutert',
  deployment: {appId: 'enfzbwlgei1iqdn6c7xqdi43'},
})
