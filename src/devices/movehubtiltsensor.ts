import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MoveHubTiltSensor
 * @extends Device
 */
export class MoveHubTiltSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.MOVE_HUB_TILT_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.TILT) {
      /**
       * Emits when a tilt sensor is activated.
       * @event MoveHubTiltSensor#tilt
       * @type {object}
       * @param {number} x
       * @param {number} y
       */
      const x = -message.readInt8(4)
      const y = message.readInt8(5)
      this.notify('tilt', { x, y })
    }
  }
}

export enum Mode {
  TILT = 0x00
}

export const ModeMap: { [event: string]: number } = {
  tilt: Mode.TILT
}
