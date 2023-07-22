import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicLargeLinearMotor extends AbsoluteMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.TechnicLargeLinearMotor)
  }
}
