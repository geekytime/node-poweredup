import * as Consts from '../consts.js'
import { BaseHub } from '../hubs/basehub.js'
import { BasicMotor } from './basicmotor.js'

/**
 * @class DuploTrainBaseMotor
 * @extends BasicMotor
 */
export class DuploTrainBaseMotor extends BasicMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, {}, Consts.DeviceType.DUPLO_TRAIN_BASE_MOTOR)
  }
}
