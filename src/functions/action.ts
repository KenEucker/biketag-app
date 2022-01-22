import { builder, Handler } from '@netlify/functions'
import biketagApi from './index'
import { getBikeTagClientOpts, getPayloadOpts } from '../common/methods'
import request from 'request'
import { Game } from 'biketag/lib/common/schema'
import { BikeTagClient } from 'biketag'

const wrapper: Handler = async (event) => {
  const route = process.env.defaultRoute ?? 'game'
  let routeHandler = biketagApi[route]

  if (!routeHandler) {
    return {
      body: 'action does not exist',
      statusCode: 404,
    }
  } else {
    const biketagOpts = getBikeTagClientOpts({
      ...event,
      method: event.httpMethod,
    } as unknown as request.Request)
    const biketag = new BikeTagClient(biketagOpts)
    const game = (await biketag.game(biketagOpts.game, {
      source: 'sanity',
      concise: true,
    })) as unknown as Game
    const biketagPayload = getPayloadOpts(event, {
      imgur: {
        hash: game.mainhash,
      },
      game: biketagOpts.game,
      size: '',
      data: false,
    })
    
    routeHandler(biketag, biketagPayload)
  }
}
const handlerWrapper = builder(wrapper)
export { handlerWrapper }
