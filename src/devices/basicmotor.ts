import * as Consts from '../consts.js'
import { DeviceId } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { calculateRamp, mapSpeed } from '../utils.js'
import { Device } from './device.js'

export class BasicMotor extends Device {
  constructor(hub: BaseHub, portId: number, type: DeviceId) {
    super(hub, portId, type)
  }

  /**
   * Set the motor power.
   * @method BasicMotor#setPower
   * @param {number} power For forward, a value between 1 - 100 should be set. For reverse, a value between -1 to -100. Stop is 0.
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setPower(powerPercent: number, interrupt: boolean = true) {
    if (interrupt) {
      this.cancelEventTimer()
    }
    const data = Buffer.from([mapSpeed(powerPercent)])
    return this.writeDirect({ mode: 0, data })
  }

  /**
   * Ramp the motor power.
   * @method BasicMotor#rampPower
   * @param {number} fromPower For forward, a value between 1 - 100 should be set. For reverse, a value between -1 to -100. Stop is 0.
   * @param {number} toPower For forward, a value between 1 - 100 should be set. For reverse, a value between -1 to -100. Stop is 0.
   * @param {number} time How long the ramp should last (in milliseconds).
   * @returns {Promise} Resolved upon successful completion of command.
   */
  public rampPower(fromPower: number, toPower: number, time: number) {
    this.cancelEventTimer()
    return new Promise((resolve) => {
      calculateRamp(this, fromPower, toPower, time)
        .on('changePower', (power) => {
          this.setPower(power, false)
        })
        .on('finished', resolve)
    })
  }

  /**
   * Stop the motor.
   * @method BasicMotor#stop
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public stop() {
    this.cancelEventTimer()
    return this.setPower(0)
  }

  /**
   * Brake the motor.
   * @method BasicMotor#brake
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public brake() {
    this.cancelEventTimer()
    return this.setPower(Consts.BrakingStyle.BRAKE)
  }

  modes = {}
}
