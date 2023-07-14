import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { Device } from './device.js'

/**
 * @class TiltSensor
 * @extends Device
 */
export class TiltSensor extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.TILT_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === TiltSensorMode.TILT) {
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
}

export enum TiltSensorMode {
  TILT = 0
}

export const ModeMap: { [event: string]: number } = {
  tilt: TiltSensorMode.TILT
}
