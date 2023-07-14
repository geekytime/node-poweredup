import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { Device } from './device.js'

/**
 * @class DuploTraniBaseSpeedometer
 * @extends Device
 */
export class DuploTrainBaseSpeedometer extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.DUPLO_TRAIN_BASE_SPEEDOMETER)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.SPEED) {
      const speed = message.readInt16LE(4)

      /**
       * Emits on a speed change.
       * @event DuploTrainBaseSpeedometer#speed
       * @type {object}
       * @param {number} speed
       */
      this.notify('speed', { speed })
    }
  }
}

export enum Mode {
  SPEED = 0
}

export const ModeMap: { [event: string]: number } = {
  speed: Mode.SPEED
}
