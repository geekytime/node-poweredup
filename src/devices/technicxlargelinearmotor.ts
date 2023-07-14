import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { AbsoluteMotor } from './absolutemotor.js'

/**
 * @class TechnicXLargeLinearMotor
 * @extends AbsoluteMotor
 */
export class TechnicXLargeLinearMotor extends AbsoluteMotor {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.TECHNIC_XLARGE_LINEAR_MOTOR)
  }
}
