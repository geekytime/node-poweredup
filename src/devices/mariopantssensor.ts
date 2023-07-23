import Debug from 'debug'

import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

const debug = Debug('mario')

/**
 * @class MarioPantsSensor
 * @extends Device
 */
export class MarioPantsSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MarioPantsSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.pants) {
      debug('pants', message)
      /**
       * Emits when the user changes the pants on Mario.
       * @event MarioPantsSensor#pants
       * @type {object}
       * @param {number} pants
       */
      const pants = message[4]
      this.notify('pants', { pants })
    }
  }

  modes = {
    pants: 0
  }
}
