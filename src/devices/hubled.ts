import * as Consts from '../consts.js'
import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class HubLED
 * @extends Device
 */
export class HubLED extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.HubLed)
  }

  /**
   * Set the color of the LED on the Hub via a color value.
   * @method HubLED#setColor
   * @param {Color} color
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setColor(color: number | boolean) {
    return new Promise<void>((resolve) => {
      if (typeof color === 'boolean') {
        color = 0
      }
      if (this.isWeDo2SmartHub) {
        this.send({
          message: Buffer.from([0x06, 0x17, 0x01, 0x01]),
          characteristic: Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
        })
        this.send({
          message: Buffer.from([0x06, 0x04, 0x01, color]),
          characteristic: Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
        })
      } else {
        this.subscribe(this.modes.color)
        this.writeDirect({ mode: 0x00, data: Buffer.from([color]) })
      }
      return resolve()
    })
  }

  /**
   * Set the color of the LED on the Hub via RGB values.
   * @method HubLED#setRGB
   * @param {number} red
   * @param {number} green
   * @param {number} blue
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setRGB(red: number, green: number, blue: number) {
    return new Promise<void>((resolve) => {
      if (this.isWeDo2SmartHub) {
        this.send({
          message: Buffer.from([0x06, 0x17, 0x01, 0x02]),
          characteristic: Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
        })
        this.send({
          message: Buffer.from([0x06, 0x04, 0x03, red, green, blue]),
          characteristic: Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
        })
      } else {
        this.subscribe(this.modes.rgb)
        this.writeDirect({ mode: 1, data: Buffer.from([red, green, blue]) })
      }
      return resolve()
    })
  }

  modes = {
    color: 0,
    rgb: 1
  }
}
