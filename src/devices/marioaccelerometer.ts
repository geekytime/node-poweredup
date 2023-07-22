import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class MarioAccelerometer extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MarioAccelerometer)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.accel) {
      const x = message[4]
      const y = message[5]
      const z = message[6]
      this.notify('accel', { x, y, z })
    } else if (mode === this.modes.gesture) {
      const gesture = message[4]
      this.notify('gesture', { gesture })
    }
  }

  modes = {
    accel: 0,
    gesture: 1
  }
}
