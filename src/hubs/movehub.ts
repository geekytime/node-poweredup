import { compareVersions } from 'compare-versions'
import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('movehub')

export class MoveHub extends LPF2Hub {
  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.MOVE_HUB)
    debug('Discovered Move Hub')
  }

  public async connect() {
    debug('Connecting to Move Hub')
    await super.connect()
    debug('Connect completed')
  }

  protected _checkFirmware(version: string) {
    if (compareVersions('2.0.00.0017', version) === 1) {
      throw new Error(
        `Your Move Hub's (${this.name}) firmware is out of date and unsupported by this library. Please update it via the official Powered Up app.`
      )
    }
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  HUB_LED: 50,
  TILT_SENSOR: 58,
  CURRENT_SENSOR: 59,
  VOLTAGE_SENSOR: 60
}
