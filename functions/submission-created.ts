import { builder, Handler } from '@netlify/functions'

const formHandler: Handler = async (event) => {
  console.log({ event })
  /// TODO: route to correct form action

  return {
    data: JSON.stringify({ event }),
    statusCode: 200,
  }
}

const handler = builder(formHandler)

export { handler }
