import { BikeTagClient } from 'biketag'
import { getPlayersPayload } from 'biketag/lib/common/payloads'

const playersHandler = async (client: BikeTagClient, payload: any) => {
  const playersResponse = await client.getPlayers(payload as getPlayersPayload, {
    source: 'imgur',
  })
  const { success, data } = playersResponse

  return {
    statusCode: playersResponse.status,
    body: JSON.stringify(success ? data : playersResponse),
  }
}

export default playersHandler
