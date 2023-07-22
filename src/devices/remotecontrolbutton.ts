import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class RemoteControlButton
 * @extends Device
 */
export class RemoteControlButton extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.RemoteControlButton)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    if (mode === this.modes.remoteButton) {
      /**
       * Emits when a button on the remote is pressed or released.
       * @event RemoteControlButton#button
       * @type {object}
       * @param {number} event
       */
      const event = message[4]
      this.notify('remoteButton', { event })
    }
  }

  modes = {
    remoteButton: 0
  }
}

export const ButtonState: { [state: string]: number } = {
  UP: 0x01,
  DOWN: 0xff,
  STOP: 0x7f,
  RELEASED: 0x00
}
