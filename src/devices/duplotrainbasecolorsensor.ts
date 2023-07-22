import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { parseColor } from '../utils.js'
import { Device } from './device.js'

export class DuploTrainBaseColorSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.DuploTrainBaseColorSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.intensity) {
      const intensity = message[4]

      /**
       * Emits when intensity of the color/light changes.
       * @event DuploTrainBaseColorSensor#intensity
       * @type {object}
       * @param {number} intensity
       */
      this.notify('intensity', { intensity })
    } else if (mode === this.modes.color) {
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
    } else if (mode === this.modes.reflect) {
      const reflect = message[4]

      /**
       * Emits when the light reflectivity changes.
       * @event DuploTrainBaseColorSensor#reflect
       * @type {object}
       * @param {number} reflect Percentage, from 0 to 100.
       */
      this.notify('reflect', { reflect })
    } else if (mode === this.modes.rgb) {
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

  modes = {
    intensity: 0,
    color: 1,
    reflect: 2,
    rgb: 3
  }
}
