
import dotenv from 'dotenv'
import { BikeTagClient } from 'biketag'
import { join } from 'path'
import Papa from 'papaparse'
import { writeFileSync } from 'fs'
import { Tag } from 'biketag/lib/common/schema'

dotenv.config()

const opts = {
    game: process.env.BIKETAG_GAME ?? 'portland',
    imgur: {
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      accessToken: process.env.IMGUR_ACCESS_TOKEN,
      hash: process.env.IMGUR_HASH,
    },
    sanity: {
      useCdn: false,
      token: process.env.SANITY_ACCESS_TOKEN,
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
    },
    reddit: {
      subreddit: process.env.REDDIT_SUBREDDIT ? process.env.REDDIT_SUBREDDIT : 'cyclepdx',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    },
    googleApiKey: process.env.GOOGLE_API_KEY,
}

const biketag = new BikeTagClient(opts)
  
const exportBikeTags = async (client: BikeTagClient) => {
  const game = await client.game(opts.game)

  if (!game) {
    return console.log('no game, no dice')
  }

  const tags = await client.tags() as Tag[]
  const exportString = Papa.unparse(tags)
  const exportFilePath = join(process.cwd(), 'files', process.env.EXPORT_FILE ?? `${opts.game}-export.csv`)

  console.log({tags, exportFilePath, exportString})

  writeFileSync(exportFilePath, exportString)
}
  
  exportBikeTags(biketag)