import { deviceIdsByName } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'
import { BasicMotor } from './basicmotor.js'

/**
 * @class DuploTrainBaseMotor
 * @extends BasicMotor
 */
export class DuploTrainBaseMotor extends BasicMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceIdsByName.DuploTrainBaseMotor)
  }
}
