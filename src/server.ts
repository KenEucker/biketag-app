import {
  BikeTagClient,
  BikeTagConfiguration,
  BikeTagCredentials,
} from 'biketag'
import { EventEmitter } from 'events'
import biketagApi from './functions'
import { DomainInfo, getBikeTagClientOpts, getDomainInfo } from './common'
import request from 'request'
import { BikeTagServerConfiguration } from 'biketag/lib/common/types'
import {
  getAmbassadorsPayload,
  getGamePayload,
  getPlayersPayload,
  getSettingsPayload,
  getTagsPayload,
  queueTagPayload,
} from 'biketag/lib/common/payloads'

export class BikeTagApp extends EventEmitter {
  private client: BikeTagClient

  constructor(
    readonly configuration: BikeTagConfiguration | BikeTagCredentials
  ) {
    super()
    this.client = new BikeTagClient(configuration)
  }

  /// ****************************  Protected Methods   ******************************** ///
  protected getDomainInfo(
    req: request.Request | undefined,
    self: any = this
  ): DomainInfo {
    return getDomainInfo(req, self)
  }

  protected getBikeTagClientOpts(
    req: request.Request
  ): BikeTagServerConfiguration {
    return getBikeTagClientOpts(req) as BikeTagServerConfiguration
  }

  protected getClient(req: request.Request): {
    client: BikeTagClient
    opts: BikeTagServerConfiguration
  } {
    const opts = getBikeTagClientOpts(req) as BikeTagServerConfiguration
    const client = this.client ?? new BikeTagClient(opts)

    return {
      client,
      opts,
    }
  }

  /// ****************************  Generic Methods   ********************************** ///

  /// ****************************  Handler Methods   ********************************* ///
  game(req: request.Request, payload?: getGamePayload) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Game(
      client,
      payload ?? (opts as unknown as getGamePayload)
    )
  }
  tags(req: request.Request, payload?: getTagsPayload) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Tags(
      client,
      payload ?? (opts as unknown as getTagsPayload)
    )
  }
  ambassadors(req: request.Request, payload?: getAmbassadorsPayload) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Ambassadors(
      client,
      payload ?? (opts as unknown as getAmbassadorsPayload)
    )
  }
  players(req: request.Request, payload?: getPlayersPayload) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Players(
      client,
      payload ?? (opts as unknown as getPlayersPayload)
    )
  }
  settings(req: request.Request) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Settings(client, opts as unknown as getSettingsPayload)
  }
  current(req: request.Request) {
    const { client, opts } = this.getClient(req)
    return biketagApi.Current(client, opts)
  }
  form(req: request.Request) {
    const { client, opts } = this.getClient(req)
    return biketagApi.QueueTag(client, opts as unknown as queueTagPayload)
  }
}

export type { BikeTagConfiguration, BikeTagCredentials }
