import {
  getDomainInfo,
  getImgurImageSized,
} from '../common/methods'
import { BikeTagClient } from 'biketag'
import request from 'request'
import axios from 'axios'

const currentTagHandler = async (client: BikeTagClient, payload: any) => {
  const currentTagResponse = await client.getTag(payload)

  if (currentTagResponse.success) {
    const currentTag = currentTagResponse.data
    const data: any = currentTag
    const domainInfo = getDomainInfo(event as unknown as request.Request)
    data.host = domainInfo.host
    data.imageUri = getImgurImageSized(data.mysteryImageUrl, payload.size)

    if (payload.data) {
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      }
    }

    const body = Buffer.from(
      (
        await axios.get(data.imageUri, {
          responseType: 'arraybuffer',
        })
      ).data,
      'utf-8'
    ).toString('base64')

    return {
      statusCode: 200,
      isBase64Encoded: true,
      body,
    }
  }

  return {
    statusCode: currentTagResponse.status,
    body: currentTagResponse.error,
  }
}

export default currentTagHandler