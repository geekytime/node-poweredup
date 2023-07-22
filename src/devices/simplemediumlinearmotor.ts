import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { BasicMotor } from './basicmotor.js'

/**
 * @class SimpleMediumLinearMotor
 * @extends Device
 */
export class SimpleMediumLinearMotor extends BasicMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.SimpleMediumLinearMotor)
  }
}
