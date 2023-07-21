import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class TechnicForceSensor
 * @extends Device
 */
export class TechnicForceSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.TECHNIC_FORCE_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.FORCE) {
      const force = message[this.isWeDo2SmartHub ? 2 : 4] / 10

      /**
       * Emits when force is applied.
       * @event TechnicForceSensor#force
       * @type {object}
       * @param {number} force Force, in newtons (0-10).
       */
      this.notify('force', { force })
    } else if (mode === Mode.TOUCHED) {
      const touched = message[4] ? true : false

      /**
       * Emits when the sensor is touched.
       * @event TechnicForceSensor#touch
       * @type {object}
       * @param {boolean} touch Touched on/off (boolean).
       */
      this.notify('touched', { touched })
    } else if (mode === Mode.TAPPED) {
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
}

export enum Mode {
  FORCE = 0,
  TOUCHED = 1,
  TAPPED = 2
}

export const ModeMap: { [event: string]: number } = {
  force: Mode.FORCE,
  touched: Mode.TOUCHED,
  tapped: Mode.TAPPED
}
