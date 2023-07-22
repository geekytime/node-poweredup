import * as Consts from '../consts.js'
import { deviceNumbersByName } from '../device-type.js'
import { BaseHub } from '../hubs/basehub.js'
import { Device } from './device.js'

/**
 * @class DuploTrainBaseSpeaker
 * @extends Device
 */
export class DuploTrainBaseSpeaker extends Device {
  constructor(hub: BaseHub, portId: number) {
    super(hub, portId, deviceNumbersByName.DuploTrainBaseSpeaker)
  }

  /**
   * Play a built-in train sound.
   * @method DuploTrainBaseSpeaker#playSound
   * @param {DuploTrainBaseSound} sound
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public playSound(sound: Consts.DuploTrainBaseSound) {
    return new Promise<void>((resolve) => {
      this.subscribe(Mode.SOUND)
      this.writeDirect(0x01, Buffer.from([sound]))
      return resolve()
    })
  }

  /**
   * Play a built-in system tone.
   * @method DuploTrainBaseSpeaker#playTone
   * @param {number} tone
   * @returns {Promise} Resolved upon successful issuance of the command.
   */
  public playTone(tone: number) {
    this.subscribe(Mode.TONE)
    this.writeDirect(0x02, Buffer.from([tone]))
  }

  modes = {
    sound: 1,
    tone: 2
  }
}

export enum Mode {
  SOUND = 0x01,
  TONE = 0x02
}
