import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class DuploTraniBaseSpeedometer
 * @extends Device
 */
export class DuploTrainBaseSpeedometer extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.DuploTrainBaseSpeedometer)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.speed) {
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

  modes = {
    speed: 0
  }
}
