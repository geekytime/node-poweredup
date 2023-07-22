import { DeviceId, deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicMediumAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    type: DeviceId = deviceIdsByName.TechnicMediumAngularMotor
  ) {
    super(hub, portId, type)
  }
}
