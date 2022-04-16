import { builder, Handler } from '@netlify/functions'
import { getPayloadOpts } from '../src/common/utils'

const helloHandler: Handler = async (event) => {
  const body = getPayloadOpts(event)
  console.log({ event, body })

  return {
    statusCode: 200,
    body: JSON.stringify({ hello: body.hello ?? 'world' }),
  }
}

const handler = builder(helloHandler)

export { handler }
