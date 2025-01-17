import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { calculateRamp } from '../utils.js'
import { Device } from './device.js'

/**
 * @class Light
 * @extends Device
 */
export class Light extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.Light)
  }

  /**
   * Set the light brightness.
   * @method Light#setBrightness
   * @param {number} brightness Brightness value between 0-100 (0 is off)
   * @returns {Promise} Resolved upon successful completion of command.
   */
  public setBrightness(brightness: number, interrupt: boolean = true) {
    if (interrupt) {
      this.cancelEventTimer()
    }
    return new Promise<void>((resolve) => {
      this.writeDirect({ mode: 0x00, data: Buffer.from([brightness]) })
      return resolve()
    })
  }

  /**
   * Ramp the light brightness.
   * @method Light#rampBrightness
   * @param {number} fromBrightness Brightness value between 0-100 (0 is off)
   * @param {number} toBrightness Brightness value between 0-100 (0 is off)
   * @param {number} time How long the ramp should last (in milliseconds).
   * @returns {Promise} Resolved upon successful completion of command.
   */
  public rampBrightness(
    fromBrightness: number,
    toBrightness: number,
    time: number
  ) {
    this.cancelEventTimer()
    return new Promise((resolve) => {
      calculateRamp(this, fromBrightness, toBrightness, time)
        .on('changePower', (power) => {
          this.setBrightness(power, false)
        })
        .on('finished', resolve)
    })
  }

  modes = {}
}
