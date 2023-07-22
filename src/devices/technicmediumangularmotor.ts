import { DeviceNumber, deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicMediumAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    type: DeviceNumber = deviceNumbersByName.TechnicMediumAngularMotor
  ) {
    super(hub, portId, type)
  }
}
