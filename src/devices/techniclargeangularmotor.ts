import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

/**
 * @class TechnicLargeAngularMotor
 * @extends AbsoluteMotor
 */
export class TechnicLargeAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    _modeMap: { [event: string]: number } = {},
    type: Consts.DeviceType = Consts.DeviceType.TECHNIC_LARGE_ANGULAR_MOTOR
  ) {
    super(hub, portId, {}, type)
  }
}
