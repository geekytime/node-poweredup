import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { BasicMotor } from './basicmotor.js'

/**
 * @class TrainMotor
 * @extends BasicMotor
 */
export class TrainMotor extends BasicMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.TRAIN_MOTOR)
  }
}
