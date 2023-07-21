import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('hub')

/**
 * The TechnicSmallHub is emitted if the discovered device is a Technic Small Hub.
 * @class Hub
 * @extends LPF2Hub
 * @extends BaseHub
 */
export class TechnicSmallHub extends LPF2Hub {
  protected _currentPort = 0x3b

  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.TECHNIC_SMALL_HUB)
    debug('Discovered Spike Essential Hub')
  }

  public async connect() {
    debug('Connecting to Spike Essential Hub')
    await super.connect()
    debug('Connect completed')
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 0,
  B: 1,
  HUB_LED: 49,
  CURRENT_SENSOR: 59,
  VOLTAGE_SENSOR: 60,
  ACCELEROMETER: 97,
  GYRO_SENSOR: 98,
  TILT_SENSOR: 99
}
