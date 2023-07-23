import Debug from 'debug'

import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

const debug = Debug('mario')

export class MarioBarcodeSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MarioBarcodeSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.barcode) {
      /**
       * Emits when the barcode sensor sees a barcode.
       * @event MarioBarcodeSensor#barcode
       * @type {object}
       * @param {number} id
       */
      const barcode = message.readUInt16LE(4)
      const color = message.readUInt16LE(6)
      if (color === 0xffff) {
        debug('barcode', barcode)
        this.notify('barcode', { barcode })
      } else if (barcode === 0xffff) {
        debug('color', color)
        this.notify('barcode', { color })
      }
    } else if (mode === this.modes.rgb) {
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
      debug('rgb', { r, g, b })
      this.notify('rgb', { r, g, b })
    }
  }

  modes = {
    barcode: 0,
    rgb: 1
  }
}
