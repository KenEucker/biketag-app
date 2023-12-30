export default defineEventHandler(async (event) => {
  console.log({ event })
  /// TODO: route to correct form action

  return {
    data: JSON.stringify({ event }),
    statusCode: 200,
  }
})
