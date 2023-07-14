import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { Device } from './device.js'

/**
 * @class TechnicMediumHubAccelerometerSensor
 * @extends Device
 */
export class TechnicMediumHubAccelerometerSensor extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(
      hub,
      portId,
      ModeMap,
      Consts.DeviceType.TECHNIC_MEDIUM_HUB_ACCELEROMETER
    )
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.ACCEL) {
      /**
       * Emits when accelerometer detects movement. Measured in mG.
       * @event TechnicMediumHubAccelerometerSensor#accel
       * @type {object}
       * @param {number} x
       * @param {number} y
       * @param {number} z
       */
      const x = Math.round(message.readInt16LE(4) / 4.096)
      const y = Math.round(message.readInt16LE(6) / 4.096)
      const z = Math.round(message.readInt16LE(8) / 4.096)
      this.notify('accel', { x, y, z })
    }
  }
}

export enum Mode {
  ACCEL = 0x00
}

export const ModeMap: { [event: string]: number } = {
  accel: Mode.ACCEL
}
