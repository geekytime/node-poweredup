import Debug from 'debug'

import * as Consts from '../consts.js'
import { IBLEAbstraction } from '../interfaces.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('movehub')

/**
 * Mario is emitted if the discovered device is a LEGO Super Mario brick.
 * @class Mario
 * @extends LPF2Hub
 * @extends BaseHub
 */
export class Mario extends LPF2Hub {
  constructor(device: IBLEAbstraction) {
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
