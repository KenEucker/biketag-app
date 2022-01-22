import { BikeTagClient } from 'biketag'
import { getGamePayload } from 'biketag/lib/common/payloads'

const gameHandler = async (client: BikeTagClient, payload: any) => {
  const gameResponse = await client.getGame(payload as getGamePayload, { source: 'sanity' })
  const { success, data } = gameResponse

  return {
    statusCode: gameResponse.status,
    body: JSON.stringify(success ? data : gameResponse),
  }
}

export default gameHandler
