import { DeviceId, deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicLargeAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    type: DeviceId = deviceIdsByName.TechnicLargeAngularMotor
  ) {
    super(hub, portId, type)
  }
}
