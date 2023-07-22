import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MotionSensor
 * @extends Device
 */
export class MotionSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MotionSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.distance) {
      let distance = message[this.isWeDo2SmartHub ? 2 : 4]
      if (message[this.isWeDo2SmartHub ? 3 : 5] === 1) {
        distance = distance + 255
      }
      distance *= 10
      /**
       * Emits when a distance sensor is activated.
       * @event MotionSensor#distance
       * @type {object}
       * @param {number} distance Distance, in millimeters.
       */
      this.notify('distance', { distance })
    }
  }

  modes = {
    distance: 0
  }
}
