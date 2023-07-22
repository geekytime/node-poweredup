import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MarioPantsSensor
 * @extends Device
 */
export class MarioPantsSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.MarioPantsSensor)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.pants) {
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
