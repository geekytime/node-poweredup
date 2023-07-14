import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { AbsoluteMotor } from './absolutemotor.js'

/**
 * @class TechnicLargeLinearMotor
 * @extends AbsoluteMotor
 */
export class TechnicLargeLinearMotor extends AbsoluteMotor {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.TECHNIC_LARGE_LINEAR_MOTOR)
  }
}
