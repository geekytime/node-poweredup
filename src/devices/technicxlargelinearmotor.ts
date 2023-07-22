import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

export class TechnicXLargeLinearMotor extends AbsoluteMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.TechnicXLargeLinearMotor)
  }
}
