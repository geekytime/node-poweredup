import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('movehub')

export class Mario extends LPF2Hub {
  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.MARIO)
    debug('Discovered Mario')
  }

  public async connect() {
    debug('Connecting to Mario')
    await super.connect()
    debug('Connect completed')
  }
}

export const PortMap: { [portName: string]: number } = {}
