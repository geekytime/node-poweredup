import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { parseColor } from '../utils.js'
import { Device } from './device.js'

/**
 * @class DuploTrainBaseColorSensor
 * @extends Device
 */
export class DuploTrainBaseColorSensor extends Device {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.DUPLO_TRAIN_BASE_COLOR_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.INTENSITY) {
      const intensity = message[4]

      /**
       * Emits when intensity of the color/light changes.
       * @event DuploTrainBaseColorSensor#intensity
       * @type {object}
       * @param {number} intensity
       */
      this.notify('intensity', { intensity })
    } else if (mode === Mode.COLOR) {
      if (message[4] <= 10) {
        const color = parseColor(message[4])

        /**
         * Emits when a color sensor is activated.
         * @event DuploTrainBaseColorSensor#color
         * @type {object}
         * @param {Color} color
         */
        this.notify('color', { color })
      }
    } else if (mode === Mode.REFLECTIVITY) {
      const reflect = message[4]

      /**
       * Emits when the light reflectivity changes.
       * @event DuploTrainBaseColorSensor#reflect
       * @type {object}
       * @param {number} reflect Percentage, from 0 to 100.
       */
      this.notify('reflect', { reflect })
    } else if (mode === Mode.RGB) {
      const red = Math.floor(message.readUInt16LE(4) / 4)
      const green = Math.floor(message.readUInt16LE(6) / 4)
      const blue = Math.floor(message.readUInt16LE(8) / 4)

      /**
       * Emits when the light reflectivity changes.
       * @event DuploTrainBaseColorSensor#rgb
       * @type {object}
       * @param {number} red
       * @param {number} green
       * @param {number} blue
       */
      this.notify('rgb', { red, green, blue })
    }
  }
}

export enum Mode {
  INTENSITY = 0x00,
  COLOR = 0x01,
  REFLECTIVITY = 0x02,
  RGB = 0x03
}

export const ModeMap: { [event: string]: number } = {
  intensity: Mode.INTENSITY,
  color: Mode.COLOR,
  reflect: Mode.REFLECTIVITY,
  rgb: Mode.RGB
}
