import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { TachoMotor } from './tachomotor.js'

/**
 * @class MediumLinearMotor
 * @extends TachoMotor
 */
export class MediumLinearMotor extends TachoMotor {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.MEDIUM_LINEAR_MOTOR)
  }
}
