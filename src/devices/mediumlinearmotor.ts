import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { TachoMotor } from './tachomotor.js'

/**
 * @class MediumLinearMotor
 * @extends TachoMotor
 */
export class MediumLinearMotor extends TachoMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.MEDIUM_LINEAR_MOTOR)
  }
}
