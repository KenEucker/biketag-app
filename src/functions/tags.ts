import { BikeTagClient } from 'biketag'
import { getTagsPayload } from 'biketag/lib/common/payloads'

const tagsHandler = async (client: BikeTagClient, payload: any) => {
  const tagsResponse = await client.getTags(payload as getTagsPayload, {
    source: 'imgur',
  })
  const { success, data } = tagsResponse
  return {
    statusCode: tagsResponse.status,
    body: JSON.stringify({ data: success ? data : tagsResponse, payload }),
  }
}

export default tagsHandler