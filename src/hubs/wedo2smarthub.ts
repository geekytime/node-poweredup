import Debug from 'debug'

import * as Consts from '../consts.js'
import { createDeviceByType } from '../create-device-by-type.js'
import { DeviceId } from '../device-ids.js'
import { HubDevice } from '../hub-device.js'
import { ServiceIds } from '../hub-type.js'
import { BaseHub } from './basehub.js'

const debug = Debug('wedo2smarthub')

export class WeDo2SmartHub extends BaseHub {
  private _lastTiltX: number = 0
  private _lastTiltY: number = 0

  constructor(device: HubDevice) {
    super(device, PortMap, Consts.HubType.WEDO2_SMART_HUB)
    debug('Discovered WeDo 2.0 Smart Hub')
  }

  public async connect() {
    debug('Connecting to WeDo 2.0 Smart Hub')
    await super.connect()
    await this.hubDevice.discoverCharacteristicsForService(
      ServiceIds.WEDO2_SMART_HUB
    )
    await this.hubDevice.discoverCharacteristicsForService(
      ServiceIds.WEDO2_SMART_HUB_2
    )

    await this.hubDevice.discoverCharacteristicsForService('battery_service')
    await this.hubDevice.discoverCharacteristicsForService('device_information')

    debug('Connect completed')
    this.emit('connect', this)
    this.postConnectInit()
  }

  async postConnectInit() {
    this.hubDevice.subscribeToCharacteristic(
      Consts.BLECharacteristic.WEDO2_PORT_TYPE,
      this._parsePortMessage.bind(this)
    )
    this.hubDevice.subscribeToCharacteristic(
      Consts.BLECharacteristic.WEDO2_SENSOR_VALUE,
      this._parseSensorMessage.bind(this)
    )
    this.hubDevice.subscribeToCharacteristic(
      Consts.BLECharacteristic.WEDO2_BUTTON,
      this._parseSensorMessage.bind(this)
    )

    this.hubDevice.readFromCharacteristic(
      '00002a19-0000-1000-8000-00805f9b34fb',
      (err, data) => {
        if (data) {
          this._parseBatteryMessage(data)
        }
      }
    )
    this.hubDevice.subscribeToCharacteristic(
      '00002a19-0000-1000-8000-00805f9b34fb',
      this._parseHighCurrentAlert.bind(this)
    )

    this.hubDevice.subscribeToCharacteristic(
      Consts.BLECharacteristic.WEDO2_HIGH_CURRENT_ALERT,
      this._parseHighCurrentAlert.bind(this)
    )
    this.hubDevice.readFromCharacteristic(
      '00002a26-0000-1000-8000-00805f9b34fb',
      (err, data) => {
        if (data) {
          this._parseFirmwareRevisionString(data)
        }
      }
    )
  }

  public writeDirect({ portId, data }: { portId: number; data: Buffer }) {
    return this.send({
      message: Buffer.concat([Buffer.from([portId, 0x01, 0x02]), data]),
      characteristic: Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
    })
  }

  /**
   * Shutdown the Hub.
   * @method WeDo2SmartHub#shutdown
   * @returns {Promise} Resolved upon successful disconnect.
   */
  public shutdown() {
    return this.send({
      message: Buffer.from([0x00]),
      characteristic: Consts.BLECharacteristic.WEDO2_DISCONNECT
    })
  }

  /**
   * Set the name of the Hub.
   * @method WeDo2SmartHub#setName
   * @param {string} name New name of the hub (14 characters or less, ASCII only).
   * @returns {Promise} Resolved upon successful issuance of command.
   */
  public setName(name: string) {
    if (name.length > 14) {
      throw new Error('Name must be 14 characters or less')
    }
    return new Promise<void>((resolve) => {
      const message = Buffer.from(name, 'ascii')
      const characteristic = Consts.BLECharacteristic.WEDO2_NAME_ID
      // Send this twice, as sometimes the first time doesn't take
      this.send({ message, characteristic })
      this.send({ message, characteristic })
      this._name = name
      return resolve()
    })
  }

  public async send({
    message,
    characteristic
  }: {
    message: Buffer
    characteristic: string
  }) {
    if (debug.enabled) {
      debug(
        `Sent Message (${this._getCharacteristicNameFromUUID(characteristic)})`,
        message
      )
    }
    return this.hubDevice.writeToCharacteristic(characteristic, message)
  }

  public subscribe({
    portId,
    deviceId,
    mode
  }: {
    portId: number
    deviceId: DeviceId
    mode: number
  }) {
    const message = Buffer.from([
      0x01,
      0x02,
      portId,
      deviceId,
      mode,
      0x01,
      0x00,
      0x00,
      0x00,
      0x00,
      0x01
    ])
    const characteristic = Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
    this.send({ message, characteristic })
  }

  public unsubscribe({
    portId,
    deviceId,
    mode
  }: {
    portId: number
    deviceId: DeviceId
    mode: number
  }) {
    const message = Buffer.from([
      0x01,
      0x02,
      portId,
      deviceId,
      mode,
      0x01,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00
    ])
    const characteristic = Consts.BLECharacteristic.WEDO2_PORT_TYPE_WRITE
    this.send({ message, characteristic })
  }

  private _getCharacteristicNameFromUUID(uuid: string) {
    const keys = Object.keys(Consts.BLECharacteristic)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (
        Consts.BLECharacteristic[
          key as keyof typeof Consts.BLECharacteristic
        ] === uuid
      ) {
        return key
      }
    }
    return 'UNKNOWN'
  }

  private _parseHighCurrentAlert(data: Buffer) {
    debug('Received Message (WEDO2_HIGH_CURRENT_ALERT)', data)
  }

  private _parseBatteryMessage(data: Buffer) {
    debug('Received Message (WEDO2_BATTERY)', data)
    const batteryLevel = data[0]
    if (batteryLevel !== this._batteryLevel) {
      this._batteryLevel = batteryLevel
      this.emit('batteryLevel', { batteryLevel })
    }
  }

  private _parseFirmwareRevisionString(data: Buffer) {
    debug('Received Message (WEDO2_FIRMWARE_REVISION)', data)
    this._firmwareVersion = data.toString()
  }

  private _parsePortMessage(data: Buffer) {
    debug('Received Message (WEDO2_PORT_TYPE)', data)

    const portId = data[0] as DeviceId
    const event = data[1] as DeviceId
    const maybeDeviceId = data[3] as DeviceId

    const deviceId: DeviceId = event ? maybeDeviceId : 0

    if (event === 1) {
      const device = createDeviceByType({
        hub: this,
        deviceNumber: deviceId,
        portId
      })
      this.attachDevice(device)
    } else if (event === 0x00) {
      const device = this.getDeviceByPortId(portId)
      if (device) {
        this._detachDevice(device)
      }
    }
  }

  private _parseSensorMessage(message: Buffer) {
    debug('Received Message (WEDO2_SENSOR_VALUE)', message)

    if (message[0] === 0x01) {
      /**
       * Emits when a button is pressed.
       * @event WeDo2SmartHub#button
       * @param {string} button
       * @param {ButtonState} state
       */
      this.emit('button', { event: Consts.ButtonState.PRESSED })
      return
    } else if (message[0] === 0x00) {
      this.emit('button', { event: Consts.ButtonState.RELEASED })
      return
    }

    const portId = message[1]
    const device = this.getDeviceByPortId(portId)

    if (device) {
      device.receive(message)
    }
  }
}

export const PortMap: { [portName: string]: number } = {
  A: 1,
  B: 2,
  CURRENT_SENSOR: 3,
  VOLTAGE_SENSOR: 4,
  PIEZO_BUZZER: 5,
  HUB_LED: 6
}
