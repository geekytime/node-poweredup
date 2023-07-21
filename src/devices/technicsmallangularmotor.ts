import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { AbsoluteMotor } from './absolutemotor.js'

/**
 * @class TechnicSmallAngularMotor
 * @extends AbsoluteMotor
 */
export class TechnicSmallAngularMotor extends AbsoluteMotor {
  constructor(
    hub: BaseHub,
    portId: number,
    _modeMap: { [event: string]: number } = {},
    type: Consts.DeviceType = Consts.DeviceType.TECHNIC_SMALL_ANGULAR_MOTOR
  ) {
    super(hub, portId, {}, type)
  }
}
