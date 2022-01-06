
import dotenv from 'dotenv'
import { BikeTagClient } from 'biketag'
import { getGamePayload } from 'biketag/lib/common/payloads'

dotenv.config()

const opts = {
    game: 'toronto',
    imgur: {
      clientId: process.env.IMGUR_CLIENT_ID,
      hash: process.env.IMGUR_HASH,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      accessToken: process.env.IMGUR_ACCESS_TOKEN,
    },
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    },
    sanity: {
      useCdn: false,
      token: process.env.SANITY_ACCESS_TOKEN,
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
    },
  }
  const fromClass = new BikeTagClient(opts)
  
  const deleteBikeTags = async (client: BikeTagClient) => {
    /// Get game data from the API
    const game = await client.game(opts as unknown as getGamePayload)
    
    /// get tag number 1
    const response = await client.deleteTags([...Array(596).keys()])
    const {data: tags} = response

    console.log({ game, tags, response })

    // const contentClient = client.content()

    // contentClient
    //   .delete({query: '*[_type == "player"][0...999]'})
    //   .then(console.log)
    //   .catch(console.error)
  }
  
  deleteBikeTags(fromClass)