import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class TechnicMediumHubGyroSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.TechnicMediumHubGyroSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.gyro) {
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

  modes = {
    gyro: 0
  }
}
