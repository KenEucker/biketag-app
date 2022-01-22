import { BikeTagClient } from 'biketag'
import { queueTagPayload } from 'biketag/lib/common/payloads'

const queueTagHandler = async (client: BikeTagClient, payload: queueTagPayload) => {
  const queueTagResponse = await client.queueTag(payload as queueTagPayload)
  const { success, data } = queueTagResponse

  return {
    statusCode: queueTagResponse.status,
    body: JSON.stringify(success ? data : queueTagResponse),
  }
}

export default queueTagHandler
