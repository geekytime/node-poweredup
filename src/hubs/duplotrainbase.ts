import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { LPF2Hub } from './lpf2hub.js'

const debug = Debug('duplotrainbase')

export class DuploTrainBase extends LPF2Hub {
  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.DUPLO_TRAIN_BASE)
    debug('Discovered Duplo Train Base')
  }

  public async connect() {
    debug('Connecting to Duplo Train Base')
    await super.connect()
    debug('Connect completed')
  }
}

export const PortMap: { [portName: string]: number } = {
  MOTOR: 0,
  COLOR: 18,
  SPEEDOMETER: 19
}
