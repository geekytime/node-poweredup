import Debug from 'debug'

import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'
const debug = Debug('mario')

export class MarioAccelerometer extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.MarioAccelerometer)
  }

  public receive(message: Buffer) {
    const mode = this.mode
    debug('receive', message)

    if (mode === this.modes.move) {
      debug('move', message)
      const x = message[4]
      const y = message[5]
      const z = message[6]
      this.notify('move', { x, y, z })
    } else if (mode === this.modes.gesture) {
      debug('gesture', message)
      const gesture = message[4]
      this.notify('gesture', { gesture })
    }
  }

  modes = {
    move: 0,
    gesture: 1
  }
}
