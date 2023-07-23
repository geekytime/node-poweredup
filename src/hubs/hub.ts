import { compareVersions } from 'compare-versions'
import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('hub')

export class Hub extends LPF2Hub {
  protected _currentPort = 0x3b

  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.HUB)
    debug('Discovered Powered UP Hub')
  }

  public async connect() {
    debug('Connecting to Powered UP Hub')
    await super.connect()
    debug('Connect completed')
  }

  protected _checkFirmware(version: string) {
    if (compareVersions('1.1.00.0004', version) === 1) {
      throw new Error(
        `Your Powered Up Hub's (${this.name}) firmware is out of date and unsupported by this library. Please update it via the official Powered Up app.`
      )
    }
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 0,
  B: 1,
  HUB_LED: 50,
  CURRENT_SENSOR: 59,
  VOLTAGE_SENSOR: 60
}
