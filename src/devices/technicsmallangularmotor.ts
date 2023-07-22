import { DeviceId, deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicSmallAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    type: DeviceId = deviceIdsByName.TechnicSmallAngularMotor
  ) {
    super(hub, portId, type)
  }
}
