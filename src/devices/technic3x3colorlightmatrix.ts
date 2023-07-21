import { Color } from '../color.js'
import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class Technic3x3ColorLightMatrix
 * @extends Device
 */
export class Technic3x3ColorLightMatrix extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.TECHNIC_3X3_COLOR_LIGHT_MATRIX)
  }

  /**
   * Set the LED matrix, one color per LED
   * @method Technic3x3ColorLightMatrix#setMatrix
   * @param {Color[] | Color} colors Array of 9 colors, 9 Color objects, or a single color
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setMatrix(colors: number[] | number | Color[] | Color) {
    return new Promise<void>((resolve) => {
      this.subscribe(TechnicColorLightMatrixMode.PIX_0)
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
      this.writeDirect(
        TechnicColorLightMatrixMode.PIX_0,
        Buffer.from(colorArray)
      )
      return resolve()
    })
  }
}

export enum TechnicColorLightMatrixMode {
  LEV_0 = 0,
  COL_0 = 1,
  PIX_0 = 2,
  TRANS = 3
}
