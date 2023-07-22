import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MoveHubTiltSensor
 * @extends Device
 */
export class MoveHubTiltSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MoveHubTiltSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.tilt) {
      const x = -message.readInt8(4)
      const y = message.readInt8(5)
      this.notify('tilt', { x, y })
    }
  }

  modes = {
    tilt: 0
  }
}
