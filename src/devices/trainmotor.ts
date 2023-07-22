import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { BasicMotor } from './basicmotor.js'

export class TrainMotor extends BasicMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.TrainMotor)
  }
}
