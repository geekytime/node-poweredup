import { Color } from '../color.js'
import * as Consts from '../consts.js'
import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

export class Technic3x3ColorLightMatrix extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.Technic3x3ColorLightMatrix)
  }

  /**
   * Set the LED matrix, one color per LED
   * @method Technic3x3ColorLightMatrix#setMatrix
   * @param {Color[] | Color} colors Array of 9 colors, 9 Color objects, or a single color
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setMatrix(colors: number[] | number | Color[] | Color) {
    return new Promise<void>((resolve) => {
      this.subscribe(this.modes.pix)
      const colorArray = new Array<number>(9)
      for (let i = 0; i < colorArray.length; i++) {
        if (typeof colors === 'number') {
          colorArray[i] = colors + (10 << 4)
        }
        if (Array.isArray(colors) && colors[i] instanceof Color) {
          colorArray[i] = (colors[i] as Color).toValue()
        }
        if (Array.isArray(colors) && colors[i] === Consts.Color.NONE) {
          colorArray[i] = Consts.Color.NONE
        }
        if (
          Array.isArray(colors) &&
          typeof colors[i] === 'number' &&
          (colors[i] as number) <= 10
        ) {
          colorArray[i] = (colors[i] as number) + (10 << 4) // If a raw color value, set it to max brightness (10)
        }
      }
      const data = Buffer.from(colorArray)
      this.writeDirect({ mode: this.modes.pix, data })
      return resolve()
    })
  }

  modes = {
    lev: 0,
    col: 1,
    pix: 2,
    trans: 3
  }
}
