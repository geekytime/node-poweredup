import Debug from 'debug'

import * as Consts from '../consts.js'
import { IBLEAbstraction } from '../interfaces.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('remotecontrol')

/**
 * The RemoteControl is emitted if the discovered device is a Remote Control.
 * @class RemoteControl
 * @extends LPF2Hub
 * @extends BaseHub
 */
export class RemoteControl extends LPF2Hub {
  constructor(device: IBLEAbstraction) {
    super(device, PortMap, Consts.HubType.REMOTE_CONTROL)
    debug('Discovered Powered UP Remote')
  }

  public async connect() {
    debug('Connecting to Powered UP Remote')
    await super.connect()
    debug('Connect completed')
  }
}

export const PortMap: { [portName: string]: number } = {
  LEFT: 0,
  RIGHT: 1,
  HUB_LED: 52,
  VOLTAGE_SENSOR: 59,
  REMOTE_CONTROL_RSSI: 60
}
