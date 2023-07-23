import { Peripheral } from '@abandonware/noble'

import { HubDevice } from './hub-device.js'
import { HubType } from './hub-type.js'
import { DuploTrainBase } from './hubs/duplotrainbase.js'
import { Hub } from './hubs/hub.js'
import { Mario } from './hubs/mario.js'
import { MoveHub } from './hubs/movehub.js'
import { RemoteControl } from './hubs/remotecontrol.js'
import { TechnicMediumHub } from './hubs/technicmediumhub.js'
import { TechnicSmallHub } from './hubs/technicsmallhub.js'
import { WeDo2SmartHub } from './hubs/wedo2smarthub.js'

export const createHub = async (peripheral: Peripheral) => {
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
