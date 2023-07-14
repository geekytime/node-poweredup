import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { AbsoluteMotor } from './absolutemotor.js'

/**
 * @class TechnicMediumAngularMotor
 * @extends AbsoluteMotor
 */
export class TechnicMediumAngularMotor extends AbsoluteMotor {
  constructor(
    hub: IDeviceInterface,
    portId: number,
    _modeMap: { [event: string]: number } = {},
    type: Consts.DeviceType = Consts.DeviceType.TECHNIC_MEDIUM_ANGULAR_MOTOR
  ) {
    super(hub, portId, {}, type)
  }
}
