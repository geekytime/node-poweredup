import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { Device } from './device.js'

/**
 * @class MarioPantsSensor
 * @extends Device
 */
export class MarioPantsSensor extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.MARIO_PANTS_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.PANTS) {
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
}

export enum Mode {
  PANTS = 0x00
}

export const ModeMap: { [event: string]: number } = {
  pants: Mode.PANTS
}
