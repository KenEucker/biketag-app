
import dotenv from 'dotenv'
import { BikeTagClient } from 'biketag'
import { join } from 'path'
import Papa from 'papaparse'
import { writeFileSync } from 'fs'
import { Tag } from 'biketag/lib/common/schema'


const exportBikeTagsHandler = async (client: BikeTagClient, opts: any) => {
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
  
  export default exportBikeTagsHandler