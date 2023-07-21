import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class TechnicDistanceSensor
 * @extends Device
 */
export class TechnicDistanceSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, ModeMap, Consts.DeviceType.TECHNIC_DISTANCE_SENSOR)
  }

  public receive(message: Buffer) {
    const mode = this._mode

    if (mode === Mode.DISTANCE) {
      const distance = message.readUInt16LE(4)

      /**
       * Emits when the detected distance changes (Slow sampling covers 40mm to 2500mm).
       * @event TechnicDistanceSensor#distance
       * @type {object}
       * @param {number} distance Distance, from 40 to 2500mm
       */
      this.notify('distance', { distance })
    } else if (mode === Mode.FAST_DISTANCE) {
      const fastDistance = message.readUInt16LE(4)

      /**
       * Emits when the detected distance changes (Fast sampling covers 50mm to 320mm).
       * @event TechnicDistanceSensor#fastDistance
       * @type {object}
       * @param {number} fastDistance Distance, from 50 to 320mm
       */
      this.notify('fastDistance', { fastDistance })
    }
  }

  /**
   * Set the brightness (or turn on/off) of the lights around the eyes.
   * @method TechnicDistanceSensor#setBrightness
   * @param {number} topLeft Top left quadrant (above left eye). 0-100 brightness.
   * @param {number} bottomLeft Bottom left quadrant (below left eye). 0-100 brightness.
   * @param {number} topRight Top right quadrant (above right eye). 0-100 brightness.
   * @param {number} bottomRight Bottom right quadrant (below right eye). 0-100 brightness.
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public setBrightness(
    topLeft: number,
    bottomLeft: number,
    topRight: number,
    bottomRight: number
  ) {
    this.writeDirect(
      0x05,
      Buffer.from([topLeft, topRight, bottomLeft, bottomRight])
    )
  }
}

export enum Mode {
  DISTANCE = 0x00,
  FAST_DISTANCE = 0x01
}

export const ModeMap: { [event: string]: number } = {
  distance: Mode.DISTANCE,
  fastDistance: Mode.FAST_DISTANCE
}
