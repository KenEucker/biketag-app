import { BikeTagClient } from 'biketag'
import { getAmbassadorsPayload } from 'biketag/lib/common/payloads'

const ambassadorsHandler = async (client: BikeTagClient, payload: getAmbassadorsPayload) => {
  const ambassadorsResponse = await client.getAmbassadors(
    payload,
    {
      source: 'imgur',
    }
  )
  const { success, data } = ambassadorsResponse

  return {
    statusCode: ambassadorsResponse.status,
    body: JSON.stringify(success ? data : ambassadorsResponse),
  }
}

export default ambassadorsHandler
