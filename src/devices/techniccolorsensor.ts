import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { parseColor } from '../utils.js'
import { Device } from './device.js'

/**
 * @class TechnicColorSensor
 * @extends Device
 */
export class TechnicColorSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.TechnicColorSensor)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === this.modes.color) {
      if (message[4] <= 10) {
        const color = parseColor(message[4])

        /**
         * Emits when a color sensor is activated.
         * @event TechnicColorSensor#color
         * @type {object}
         * @param {Color} color
         */
        this.notify('color', { color })
      }
    } else if (mode === this.modes.reflect) {
      const reflect = message[4]

      /**
       * Emits when the light reflectivity changes.
       * @event TechnicColorSensor#reflect
       * @type {object}
       * @param {number} reflect Percentage, from 0 to 100.
       */
      this.notify('reflect', { reflect })
    } else if (mode === this.modes.ambient) {
      const ambient = message[4]

      /**
       * Emits when the ambient light changes.
       * @event TechnicColorSensor#ambient
       * @type {object}
       * @param {number} ambient Percentage, from 0 to 100.
       */
      this.notify('ambient', { ambient })
    }
  }

  /**
   * Set the brightness (or turn on/off) of the lights around the sensor.
   * @method TechnicColorSensor#setBrightness
   * @param {number} firstSegment First light segment. 0-100 brightness.
   * @param {number} secondSegment Second light segment. 0-100 brightness.
   * @param {number} thirdSegment Third light segment. 0-100 brightness.
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setBrightness(
    firstSegment: number,
    secondSegment: number,
    thirdSegment: number
  ) {
    this.writeDirect(
      0x03,
      Buffer.from([firstSegment, secondSegment, thirdSegment])
    )
  }

  modes = {
    color: 0,
    reflect: 1,
    ambient: 2
  }
}
