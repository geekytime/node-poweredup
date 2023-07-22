import * as Consts from '../consts.js'
import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class CurrentSensor
 * @extends Device
 */
export class CurrentSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.CurrentSensor)
  }

  public receive(message: Buffer) {
    const mode = this.mode

    switch (mode) {
      case this.modes.current:
        if (this.isWeDo2SmartHub) {
          const current = message.readInt16LE(2) / 1000
          this.notify('current', { current })
        } else {
          let maxCurrentValue = MaxCurrentValue[this.hub.type]
          if (maxCurrentValue === undefined) {
            maxCurrentValue = MaxCurrentValue[Consts.HubType.UNKNOWN]
          }
          let maxCurrentRaw = MaxCurrentRaw[this.hub.type]
          if (maxCurrentRaw === undefined) {
            maxCurrentRaw = MaxCurrentRaw[Consts.HubType.UNKNOWN]
          }
          const current =
            (message.readUInt16LE(4) * maxCurrentValue) / maxCurrentRaw
          /**
           * Emits when a current change is detected.
           * @event CurrentSensor#current
           * @type {object}
           * @param {number} current
           */
          this.notify('current', { current })
        }
        break
    }
  }

  modes = {
    current: 0
  }
}

const MaxCurrentValue: { [hubType: number]: number } = {
  [Consts.HubType.UNKNOWN]: 2444,
  [Consts.HubType.TECHNIC_MEDIUM_HUB]: 4175
}

const MaxCurrentRaw: { [hubType: number]: number } = {
  [Consts.HubType.UNKNOWN]: 4095
}
