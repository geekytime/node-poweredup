import { DeviceNumber, deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicSmallAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    type: DeviceNumber = deviceNumbersByName.TechnicSmallAngularMotor
  ) {
    super(hub, portId, type)
  }
}
