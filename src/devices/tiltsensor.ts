import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class TiltSensor
 * @extends Device
 */
export class TiltSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.TiltSensor)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.tilt) {
      const x = message.readInt8(this.isWeDo2SmartHub ? 2 : 4)
      const y = message.readInt8(this.isWeDo2SmartHub ? 3 : 5)
      /**
       * Emits when a tilt sensor is activated.
       * @event TiltSensor#tilt
       * @type {object}
       * @param {number} x
       * @param {number} y
       */
      this.notify('tilt', { x, y })
    }
  }

  modes = {
    tilt: 0
  }
}
