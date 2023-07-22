import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { TachoMotor } from './tachomotor.js'

/**
 * @class MoveHubMediumLinearMotor
 * @extends TachoMotor
 */
export class MoveHubMediumLinearMotor extends TachoMotor {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.MoveHubMediumLinearMotor)
  }
}
