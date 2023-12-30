import { getPayloadOpts } from '~/common/utils'

export default defineEventHandler(async (event) => {
  const body = getPayloadOpts(event)
  console.log({ event, body })

  return {
    statusCode: 200,
    body: JSON.stringify({ hello: body.hello ?? 'world' }),
  }
})