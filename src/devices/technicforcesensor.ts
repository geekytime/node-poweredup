import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class TechnicForceSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.TechnicForceSensor)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.force) {
      const force = message[this.isWeDo2SmartHub ? 2 : 4] / 10

      /**
       * Emits when force is applied.
       * @event TechnicForceSensor#force
       * @type {object}
       * @param {number} force Force, in newtons (0-10).
       */
      this.notify('force', { force })
    } else if (mode === this.modes.touched) {
      const touched = message[4] ? true : false

      /**
       * Emits when the sensor is touched.
       * @event TechnicForceSensor#touch
       * @type {object}
       * @param {boolean} touch Touched on/off (boolean).
       */
      this.notify('touched', { touched })
    } else if (mode === this.modes.tapped) {
      const tapped = message[4]

      /**
       * Emits when the sensor is tapped.
       * @event TechnicForceSensor#tapped
       * @type {object}
       * @param {number} tapped How hard the sensor was tapped, from 0-3.
       */
      this.notify('tapped', { tapped })
    }
  }

  modes = {
    force: 0,
    touched: 1,
    tapped: 2
  }
}
