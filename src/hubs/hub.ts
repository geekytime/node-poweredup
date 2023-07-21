import { Peripheral } from '@abandonware/noble'
import { compareVersions } from 'compare-versions'
import Debug from 'debug'

import * as Consts from '../consts.js'
import { HubDevice } from '../hub-device.js'
import { HubType } from '../hub-type.js'
// import { IBLEAbstraction } from '../interfaces.js'
import { DuploTrainBase } from './duplotrainbase.js'
import { LPF2Hub } from './lpf2hub.js'
import { Mario } from './mario.js'
import { MoveHub } from './movehub.js'
import { RemoteControl } from './remotecontrol.js'
import { TechnicMediumHub } from './technicmediumhub.js'
import { TechnicSmallHub } from './technicsmallhub.js'
import { WeDo2SmartHub } from './wedo2smarthub.js'

const debug = Debug('hub')

export class Hub extends LPF2Hub {
  protected _currentPort = 0x3b

  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.HUB)
    debug('Discovered Powered UP Hub')
  }

  public async connect() {
    debug('Connecting to Powered UP Hub')
    await super.connect()
    debug('Connect completed')
  }

  protected _checkFirmware(version: string) {
    if (compareVersions('1.1.00.0004', version) === 1) {
      throw new Error(
        `Your Powered Up Hub's (${this.name}) firmware is out of date and unsupported by this library. Please update it via the official Powered Up app.`
      )
    }
  }

  public static async fromPeripheral(peripheral: Peripheral) {
    const device = await HubDevice.create(peripheral)
    if (HubType.IsWeDo2SmartHub(peripheral)) {
      return new WeDo2SmartHub(device)
    } else if (HubType.IsMoveHub(peripheral)) {
      return new MoveHub(device)
    } else if (HubType.IsHub(peripheral)) {
      return new Hub(device)
    } else if (HubType.IsRemoteControl(peripheral)) {
      return new RemoteControl(device)
    } else if (HubType.IsDuploTrainBase(peripheral)) {
      return new DuploTrainBase(device)
    } else if (HubType.IsTechnicSmallHub(peripheral)) {
      return new TechnicSmallHub(device)
    } else if (HubType.IsTechnicMediumHub(peripheral)) {
      return new TechnicMediumHub(device)
    } else if (HubType.IsMario(peripheral)) {
      return new Mario(device)
    } else {
      throw new Error(`Unknown device/peripheral type: ${peripheral.uuid}`)
    }
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 0,
  B: 1,
  HUB_LED: 50,
  CURRENT_SENSOR: 59,
  VOLTAGE_SENSOR: 60
}
