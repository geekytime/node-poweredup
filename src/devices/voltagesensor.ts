import * as Consts from '../consts.js'
import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class VoltageSensor
 * @extends Device
 */
export class VoltageSensor extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.VoltageSensor)
  }

  public receive(message: Buffer) {
    if ((this._mode = this.modes.voltage)) {
      if (this.isWeDo2SmartHub) {
        const voltage = message.readInt16LE(2) / 40
        this.notify('voltage', { voltage })
      } else {
        const maxVoltageValue =
          MaxVoltageValue[this.hub.type] ||
          MaxVoltageValue[Consts.HubType.UNKNOWN]

        const maxVoltageRaw =
          MaxVoltageRaw[this.hub.type] || MaxVoltageRaw[Consts.HubType.UNKNOWN]

        const voltage =
          (message.readUInt16LE(4) * maxVoltageValue) / maxVoltageRaw

        this.notify('voltage', { voltage })
      }
    }
  }

  modes = {
    voltage: 0
  }
}

const MaxVoltageValue: { [hubType: number]: number } = {
  [Consts.HubType.UNKNOWN]: 9.615,
  [Consts.HubType.DUPLO_TRAIN_BASE]: 6.4,
  [Consts.HubType.REMOTE_CONTROL]: 6.4
}

const MaxVoltageRaw: { [hubType: number]: number } = {
  [Consts.HubType.UNKNOWN]: 3893,
  [Consts.HubType.DUPLO_TRAIN_BASE]: 3047,
  [Consts.HubType.REMOTE_CONTROL]: 3200,
  [Consts.HubType.TECHNIC_MEDIUM_HUB]: 4095
}
