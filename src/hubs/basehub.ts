import Debug from 'debug'
import { EventEmitter } from 'events'

import * as Consts from '../consts.js'
import { createDeviceByType } from '../createDeviceByType.js'
import { deviceNamesByNumber, DeviceNumber } from '../device-type.js'
import { Device } from '../devices/device.js'
import { HubDevice } from '../hub-device.js'

const debug = Debug('basehub')

export class BaseHub extends EventEmitter {
  protected _attachedDevices: { [portId: number]: Device } = {}

  protected _name: string = ''
  protected _firmwareVersion: string = '0.0.00.0000'
  protected _hardwareVersion: string = '0.0.00.0000'
  protected _primaryMACAddress: string = '00:00:00:00:00:00'
  protected _batteryLevel: number = 100
  protected _rssi: number = -60
  protected _portMap: { [portName: string]: number } = {}
  protected _virtualPorts: number[] = []

  protected _bleDevice: HubDevice

  private _type: Consts.HubType
  private _attachCallbacks: ((device: Device) => boolean)[] = []

  constructor(
    bleDevice: HubDevice,
    portMap: { [portName: string]: number } = {},
    type: Consts.HubType = Consts.HubType.UNKNOWN
  ) {
    super()
    this.setMaxListeners(23) // Technic Medium Hub has 9 built in devices + 4 external ports. Node.js throws a warning after 10 attached event listeners.
    this._type = type
    this._bleDevice = bleDevice
    this._portMap = Object.assign({}, portMap)
    bleDevice.on('disconnect', () => {
      this.emit('disconnect')
    })
  }

  public get name() {
    return this._bleDevice.name
  }

  public get connected() {
    return this._bleDevice.connected
  }

  public get connecting() {
    return this._bleDevice.connecting
  }

  public get type() {
    return this._type
  }

  public get ports() {
    return Object.keys(this._portMap)
  }

  public get firmwareVersion() {
    return this._firmwareVersion
  }

  public get hardwareVersion() {
    return this._hardwareVersion
  }

  public get primaryMACAddress() {
    return this._primaryMACAddress
  }

  public get uuid() {
    return this._bleDevice.uuid
  }

  public get batteryLevel() {
    return this._batteryLevel
  }

  public get rssi() {
    return this._rssi
  }

  public async connect() {
    if (this._bleDevice.connecting) {
      throw new Error('Already connecting')
    } else if (this._bleDevice.connected) {
      throw new Error('Already connected')
    }
    return this._bleDevice.connect()
  }

  public disconnect() {
    return this._bleDevice.disconnect()
  }

  public getDeviceAtPort(portName: string) {
    const portId = this._portMap[portName]
    if (portId !== undefined) {
      return this._attachedDevices[portId]
    } else {
      return undefined
    }
  }

  public waitForDeviceAtPort(portName: string) {
    return new Promise((resolve) => {
      const existingDevice = this.getDeviceAtPort(portName)
      if (existingDevice) {
        return resolve(existingDevice)
      }
      this._attachCallbacks.push((device) => {
        if (device.portName === portName) {
          resolve(device)
          return true
        } else {
          return false
        }
      })
    })
  }

  public getDevices() {
    return Object.values(this._attachedDevices)
  }

  public getDevicesByType(deviceType: number) {
    return this.getDevices().filter((device) => device.type === deviceType)
  }

  public waitForDeviceByType(deviceType: number) {
    return new Promise((resolve) => {
      const existingDevices = this.getDevicesByType(deviceType)
      if (existingDevices.length >= 1) {
        return resolve(existingDevices[0])
      }
      this._attachCallbacks.push((device) => {
        if (device.type === deviceType) {
          resolve(device)
          return true
        } else {
          return false
        }
      })
    })
  }

  public getPortNameForPortId(portId: number) {
    for (const port of Object.keys(this._portMap)) {
      if (this._portMap[port] === portId) {
        return port
      }
    }
    return
  }

  public isPortVirtual(portId: number) {
    return this._virtualPorts.indexOf(portId) > -1
  }

  public sleep(delay: number) {
    return new Promise<void>((resolve) => {
      global.setTimeout(resolve, delay)
    })
  }

  public wait(commands: Promise<unknown>[]) {
    return Promise.all(commands)
  }

  public send(_message: Buffer, _uuid: string) {
    return Promise.resolve()
  }

  public subscribe(_: { portId: number; deviceType?: number; mode: number }) {}

  public unsubscribe(_: {
    portId: number
    deviceType?: number
    mode: number
  }) {}

  public manuallyAttachDevice(deviceType: DeviceNumber, portId: number) {
    if (!this._attachedDevices[portId]) {
      debug(
        `No device attached to portId ${portId}, creating and attaching device type ${deviceType}`
      )
      const device = createDeviceByType({
        hub: this,
        deviceNumber: deviceType,
        portId
      })
      this._attachDevice(device)
      return device
    } else {
      if (this._attachedDevices[portId].type === deviceType) {
        debug(
          `Device of ${deviceType} already attached to portId ${portId}, returning existing device`
        )
        return this._attachedDevices[portId]
      } else {
        throw new Error(
          `Already a different type of device attached to portId ${portId}. Only use this method when you are certain what's attached.`
        )
      }
    }
  }

  protected _attachDevice(device: Device) {
    if (
      this._attachedDevices[device.portId] &&
      this._attachedDevices[device.portId].type === device.type
    ) {
      return
    }
    this._attachedDevices[device.portId] = device

    this.emit('attach', device)
    debug(
      `Attached device type ${device.type} (${
        deviceNamesByNumber[device.type]
      }) on port ${device.portName} (${device.portId})`
    )

    let i = this._attachCallbacks.length
    while (i--) {
      const callback = this._attachCallbacks[i]
      if (callback(device)) {
        this._attachCallbacks.splice(i, 1)
      }
    }
  }

  protected _detachDevice(device: Device) {
    delete this._attachedDevices[device.portId]

    this.emit('detach', device)
    debug(
      `Detached device type ${device.type} (${
        deviceNamesByNumber[device.type]
      }) on port ${device.portName} (${device.portId})`
    )
  }

  protected _getDeviceByPortId(portId: number) {
    return this._attachedDevices[portId]
  }
}
