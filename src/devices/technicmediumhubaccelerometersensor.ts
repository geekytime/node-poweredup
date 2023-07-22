import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class TechnicMediumHubAccelerometerSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.TechnicMediumHubAccelerometer)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.accel) {
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

  modes = {
    accel: 0
  }
}
