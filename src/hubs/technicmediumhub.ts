import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('technicmediumhub')

export class TechnicMediumHub extends LPF2Hub {
  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.TECHNIC_MEDIUM_HUB)
    debug('Discovered Control+ Hub')
  }

  public async connect() {
    debug('Connecting to Control+ Hub')
    await super.connect()
    debug('Connect completed')
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  HUB_LED: 50,
  CURRENT_SENSOR: 59,
  VOLTAGE_SENSOR: 60,
  ACCELEROMETER: 97,
  GYRO_SENSOR: 98,
  TILT_SENSOR: 99
}
