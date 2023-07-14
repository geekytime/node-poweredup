import * as Consts from '../consts.js'
import { IDeviceInterface } from '../interfaces.js'
import { BasicMotor } from './basicmotor.js'

/**
 * @class TrainMotor
 * @extends BasicMotor
 */
export class TrainMotor extends BasicMotor {
  constructor(hub: IDeviceInterface, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.TRAIN_MOTOR)
  }
}
