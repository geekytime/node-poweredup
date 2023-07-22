import Debug from 'debug'
import { EventEmitter } from 'events'

import * as Consts from '../consts.js'
import { createDeviceByType } from '../create-device-by-type.js'
import { DeviceId, deviceNamesById } from '../device-ids.js'
import { Device } from '../devices/device.js'
import { HubDevice } from '../hub-device.js'
import { waitFor } from '../utils.js'

const debug = Debug('basehub')

export abstract class BaseHub extends EventEmitter {
  protected devicesByPortId = new Map<number, Device>()

  protected _name: string = ''
  protected _firmwareVersion: string = '0.0.00.0000'
  protected _hardwareVersion: string = '0.0.00.0000'
  protected _primaryMACAddress: string = '00:00:00:00:00:00'
  protected _batteryLevel: number = 100
  protected _rssi: number = -60
  protected _portMap: { [portName: string]: number } = {}
  protected _virtualPorts: number[] = []

  protected hubDevice: HubDevice

  private _type: Consts.HubType

  constructor(
    hubDevice: HubDevice,
    portMap: { [portName: string]: number } = {},
    type: Consts.HubType = Consts.HubType.UNKNOWN
  ) {
    super()
    this.setMaxListeners(23) // Technic Medium Hub has 9 built in devices + 4 external ports. Node.js throws a warning after 10 attached event listeners.
    this._type = type
    this.hubDevice = hubDevice
    this._portMap = Object.assign({}, portMap)
    hubDevice.on('disconnect', () => {
      this.emit('disconnect')
    })
  }

  public get name() {
    return this.hubDevice.name
  }

  public get connected() {
    return this.hubDevice.connected
  }

  public get connecting() {
    return this.hubDevice.connecting
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
    return this.hubDevice.uuid
  }

  public get batteryLevel() {
    return this._batteryLevel
  }

  public get rssi() {
    return this._rssi
  }

  public async connect() {
    if (this.hubDevice.connecting) {
      throw new Error('Already connecting')
    } else if (this.hubDevice.connected) {
      throw new Error('Already connected')
    }
    return this.hubDevice.connect()
  }

  public disconnect() {
    return this.hubDevice.disconnect()
  }

  get devices(): Device[] {
    return Array.from(this.devicesByPortId.values())
  }

  getDeviceByPortName(portName: string): Device | undefined {
    const portId = this._portMap[portName]
    if (portId === undefined) {
      return undefined
    }
    return this.getDeviceByPortId(portId)
  }

  getDeviceByPortId(portId: number): Device | undefined {
    return this.devicesByPortId.get(portId)
  }

  public async waitForDeviceByPortName(portName: string): Promise<Device> {
    const device = await waitFor({
      timeoutMS: 5000,
      retryMS: 10,
      checkFn: () => {
        const device = this.getDeviceByPortName(portName)
        return device || false
      }
    })
    return device
  }

  public getDevicesById(deviceId: DeviceId) {
    return this.devices.filter((device) => device.type === deviceId)
  }

  public async waitForDevicesById(deviceId: DeviceId): Promise<Device[]> {
    const devices = await waitFor({
      timeoutMS: 5000,
      retryMS: 10,
      checkFn: () => {
        const devices = this.getDevicesById(deviceId)
        if (devices.length > 0) {
          return devices
        }
        return false
      }
    })
    return devices
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

  public abstract subscribe(_: {
    portId: number
    deviceType?: number
    mode: number
  })

  public abstract unsubscribe(_: {
    portId: number
    deviceType?: number
    mode: number
  })

  public manuallyAttachDevice(deviceType: DeviceId, portId: number) {
    if (!this.getDeviceByPortId(portId)) {
      debug(
        `No device attached to portId ${portId}, creating and attaching device type ${deviceType}`
      )
      const device = createDeviceByType({
        hub: this,
        deviceNumber: deviceType,
        portId
      })
      this.attachDevice(device)
      return device
    } else {
      const device = this.getDeviceByPortId(portId)
      if (device?.type === deviceType) {
        debug(
          `Device of ${deviceType} already attached to portId ${portId}, returning existing device`
        )
        return device
      } else {
        throw new Error(
          `Already a different type of device attached to portId ${portId}. Only use this method when you are certain what's attached.`
        )
      }
    }
  }

  protected attachDevice(device: Device) {
    const existingDevice = this.getDeviceByPortId(device.portId)
    if (existingDevice && existingDevice.type === device.type) {
      return
    }
    this.devicesByPortId.set(device.portId, device)
  }

  protected _detachDevice(device: Device) {
    this.emit('detach', device)
    debug(
      `Detached device type ${device.type} (${
        deviceNamesById[device.type]
      }) on port ${device.portName} (${device.portId})`
    )
  }
}
