import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class MarioAccelerometer extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.MARIO_ACCELEROMETER)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.ACCEL) {
      /**
       * Emits when accelerometer detects movement. Measured in mG.
       * @event MarioAccelerometer#accel
       * @type {object}
       * @param {number} x
       * @param {number} y
       * @param {number} z
       */
      const x = message[4]
      const y = message[5]
      const z = message[6]
      this.notify('accel', { x, y, z })
    } else if (mode === Mode.GEST) {
      /**
       * Emits when a gesture is detected
       * @event MarioAccelerometer#gest
       * @type {object}
       * @param {number} gesture
       */
      const gesture = message[4]
      this.notify('gesture', { gesture })
    }
  }
}

export enum Mode {
  ACCEL = 0,
  GEST = 1
}

export const ModeMap: { [event: string]: number } = {
  accel: Mode.ACCEL,
  gesture: Mode.GEST
}
