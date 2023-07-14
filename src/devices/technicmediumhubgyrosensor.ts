import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { Device } from './device.js'

/**
 * @class TechnicMediumHubGyroSensor
 * @extends Device
 */
export class TechnicMediumHubGyroSensor extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(
      hub,
      portId,
      ModeMap,
      Consts.DeviceType.TECHNIC_MEDIUM_HUB_GYRO_SENSOR
    )
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.GYRO) {
      /**
       * Emits when gyroscope detects movement. Measured in DPS - degrees per second.
       * @event TechnicMediumHubGyroSensor#gyro
       * @type {object}
       * @param {number} x
       * @param {number} y
       * @param {number} z
       */
      const x = Math.round((message.readInt16LE(4) * 7) / 400)
      const y = Math.round((message.readInt16LE(6) * 7) / 400)
      const z = Math.round((message.readInt16LE(8) * 7) / 400)
      this.notify('gyro', { x, y, z })
    }
  }
}

export enum Mode {
  GYRO = 0x00
}

export const ModeMap: { [event: string]: number } = {
  gyro: Mode.GYRO
}
