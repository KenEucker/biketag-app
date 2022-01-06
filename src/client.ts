import { BikeTagClient, BikeTagConfiguration, BikeTagCredentials } from 'biketag'
import { EventEmitter } from 'events'
export class BikeTagApp extends EventEmitter {
  private client: BikeTagClient

  constructor(readonly configuration: BikeTagConfiguration | BikeTagCredentials ) {
    super()
    this.client = new BikeTagClient(configuration)
  }

  /// ****************************  Protected Methods   ******************************** ///


  /// ****************************  Generic Methods   ********************************** ///


  /// ****************************  Response Methods   ********************************* ///
}

export type { BikeTagConfiguration, BikeTagCredentials }
