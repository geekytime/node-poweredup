import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MotionSensor
 * @extends Device
 */
export class MotionSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.MOTION_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.DISTANCE) {
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
}

export enum Mode {
  DISTANCE = 0x00
}

export const ModeMap: { [event: string]: number } = {
  distance: Mode.DISTANCE
}
