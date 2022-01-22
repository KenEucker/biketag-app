import { BikeTagClient } from 'biketag'
import { getGamePayload } from 'biketag/lib/common/payloads'

const deleteBikeTagsHandler = async (client: BikeTagClient, opts: any) => {
  /// Get game data from the API
  const game = await client.game(opts as unknown as getGamePayload)

  /// get tag number 1
  const response = await client.deleteTags([...Array(596).keys()])
  const { data: tags } = response

  console.log({ game, tags, response })

  // const contentClient = client.content()

  // contentClient
  //   .delete({query: '*[_type == "player"][0...999]'})
  //   .then(console.log)
  //   .catch(console.error)
}

export default deleteBikeTagsHandler
