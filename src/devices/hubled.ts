import * as Consts from '../consts.js'
import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class HubLED
 * @extends Device
 */
export class HubLED extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.HubLed)
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
        this.send(
          Buffer.from([0x06, 0x17, 0x01, 0x01]),
          Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
        )
        this.send(
          Buffer.from([0x06, 0x04, 0x01, color]),
          Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
        )
      } else {
        this.subscribe(this.modes.color)
        this.writeDirect(0x00, Buffer.from([color]))
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
        this.send(
          Buffer.from([0x06, 0x17, 0x01, 0x02]),
          Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
        )
        this.send(
          Buffer.from([0x06, 0x04, 0x03, red, green, blue]),
          Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
        )
      } else {
        this.subscribe(this.modes.rgb)
        this.writeDirect(0x01, Buffer.from([red, green, blue]))
      }
      return resolve()
    })
  }

  modes = {
    color: 0,
    rgb: 1
  }
}
