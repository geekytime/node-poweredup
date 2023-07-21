import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class MarioBarcodeSensor
 * @extends Device
 */
export class MarioBarcodeSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.MARIO_BARCODE_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.BARCODE) {
      /**
       * Emits when the barcode sensor sees a barcode.
       * @event MarioBarcodeSensor#barcode
       * @type {object}
       * @param {number} id
       */
      const barcode = message.readUInt16LE(4)
      const color = message.readUInt16LE(6)
      if (color === 0xffff) {
        // This is a barcode
        this.notify('barcode', { barcode })
      } else if (barcode === 0xffff) {
        // This is a color
        this.notify('barcode', { color })
      }
    } else if (mode === Mode.RGB) {
      /**
       * Emits when the barcode sensor sees a RGB color.
       * @event MarioBarcodeSensor#rgb
       * @type {object}
       * @param {number} r
       * @param {number} g
       * @param {number} b
       */
      const r = message[4]
      const g = message[5]
      const b = message[6]
      this.notify('rgb', { r, g, b })
    }
  }
}

export enum Mode {
  BARCODE = 0,
  RGB = 1
}

export const ModeMap: { [event: string]: number } = {
  barcode: Mode.BARCODE,
  rgb: Mode.RGB
}
