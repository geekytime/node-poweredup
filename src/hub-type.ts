import { Peripheral } from '@abandonware/noble'

export const ServiceIds = {
  WEDO2_SMART_HUB: '00001523-1212-efde-1523-785feabcd123',
  WEDO2_SMART_HUB_2: '00004f0e-1212-efde-1523-785feabcd123',
  WEDO2_SMART_HUB_3: '2a19',
  WEDO2_SMART_HUB_4: '180f',
  WEDO2_SMART_HUB_5: '180a',
  LPF2_HUB: '00001623-1212-efde-1623-785feabcd123'
}

export const ManufacturerDataIds = {
  DUPLO_TRAIN_BASE_ID: 32,
  MOVE_HUB_ID: 64,
  HUB_ID: 65,
  REMOTE_CONTROL_ID: 66,
  MARIO_ID: 67,
  TECHNIC_MEDIUM_HUB_ID: 128,
  TECHNIC_SMALL_HUB_ID: 131
}

const magicalManufacturerDataIndex = 3

export class HubType {
  public static matchesServiceId({
    peripheral,
    serviceName
  }: {
    peripheral: Peripheral
    serviceName: keyof typeof ServiceIds
  }) {
    const serviceId: string = ServiceIds[serviceName].replace(/-/g, '')
    const serviceUuids = peripheral?.advertisement?.serviceUuids || []
    return serviceUuids.includes(serviceId)
  }

  public static matchesManufacturerData({
    peripheral,
    manufacturerDataName
  }: {
    peripheral: Peripheral
    manufacturerDataName: keyof typeof ManufacturerDataIds
  }) {
    const manufacturerDataId = ManufacturerDataIds[manufacturerDataName]
    const manufacturerData = peripheral?.advertisement?.manufacturerData || []
    return (
      manufacturerData.length > magicalManufacturerDataIndex &&
      manufacturerData[magicalManufacturerDataIndex] === manufacturerDataId
    )
  }

  public static matches({
    peripheral,
    serviceName,
    manufacturerDataName
  }: {
    peripheral: Peripheral
    serviceName: keyof typeof ServiceIds
    manufacturerDataName: keyof typeof ManufacturerDataIds
  }) {
    return (
      HubType.matchesServiceId({
        peripheral,
        serviceName
      }) &&
      HubType.matchesManufacturerData({
        peripheral,
        manufacturerDataName
      })
    )
  }

  public static IsWeDo2SmartHub(peripheral: Peripheral) {
    return this.matchesServiceId({ peripheral, serviceName: 'WEDO2_SMART_HUB' })
  }

  public static IsMoveHub(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'MOVE_HUB_ID'
    })
  }

  public static IsHub(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'HUB_ID'
    })
  }

  public static IsRemoteControl(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'REMOTE_CONTROL_ID'
    })
  }

  public static IsDuploTrainBase(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'DUPLO_TRAIN_BASE_ID'
    })
  }

  public static IsTechnicSmallHub(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'TECHNIC_SMALL_HUB_ID'
    })
  }

  public static IsTechnicMediumHub(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'TECHNIC_MEDIUM_HUB_ID'
    })
  }

  public static IsMario(peripheral: Peripheral) {
    return HubType.matches({
      peripheral,
      serviceName: 'LPF2_HUB',
      manufacturerDataName: 'MARIO_ID'
    })
  }
}
