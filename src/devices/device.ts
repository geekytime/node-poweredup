import { EventEmitter } from 'events'

import * as Consts from '../consts.js'
import { deviceNamesById, DeviceId } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'

export abstract class Device extends EventEmitter {
  public autoSubscribe: boolean = true
  public values: Record<string, unknown> = {}

  protected _mode: number | undefined
  protected _busy: boolean = false
  protected _finishedCallbacks: (() => void)[] = []

  private _hub: BaseHub
  private _portId: number
  private _connected: boolean = true
  private _type: DeviceId

  private _isWeDo2SmartHub: boolean
  private _isVirtualPort: boolean = false
  private _eventTimer: NodeJS.Timer | null = null

  abstract get modes(): Record<string, number>

  constructor(hub: BaseHub, portId: number, type: DeviceId) {
    super()
    this._hub = hub
    this._portId = portId
    this._type = type
    this._isWeDo2SmartHub = this.hub.type === Consts.HubType.WEDO2_SMART_HUB
    this._isVirtualPort = this.hub.isPortVirtual(portId)
  }

  initEvents = () => {
    for (const event in this.modes) {
      if (this.hub.listenerCount(event) > 0) {
        this.handleNewListener(event)
      }
    }

    this.hub.on('newListener', this.handleNewListener)
    this.on('newListener', this.handleNewListener)
    this.hub.on('detach', this.handleDetach)
  }

  handleNewListener = (event: string) => {
    if (event === 'detach') {
      return
    }
    if (this.autoSubscribe) {
      if (this.modes[event] !== undefined) {
        this.subscribe(this.modes[event])
      }
    }
  }

  handleDetach = (device: Device) => {
    if (device.portId === this.portId) {
      this._connected = false
      this.hub.removeListener('detach', this.handleDetach)
      this.emit('detach')
    }
  }

  public get connected() {
    return this._connected
  }

  public get hub() {
    return this._hub
  }

  public get portId() {
    return this._portId
  }

  public get portName() {
    return this.hub.getPortNameForPortId(this.portId)
  }

  public get type() {
    return this._type
  }

  public get typeName() {
    return deviceNamesById[this.type]
  }

  public get mode() {
    return this._mode
  }

  protected get isWeDo2SmartHub() {
    return this._isWeDo2SmartHub
  }

  protected get isVirtualPort() {
    return this._isVirtualPort
  }

  public writeDirect(mode: number, data: Buffer) {
    if (this.isWeDo2SmartHub) {
      return this.send(
        Buffer.concat([Buffer.from([this.portId, 0x01, 0x02]), data]),
        Consts.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE
      )
    } else {
      return this.send(
        Buffer.concat([
          Buffer.from([0x81, this.portId, 0x11, 0x51, mode]),
          data
        ]),
        Consts.BLECharacteristic.LPF2_ALL
      )
    }
  }

  public send(
    data: Buffer,
    characteristic: string = Consts.BLECharacteristic.LPF2_ALL
  ) {
    this._ensureConnected()
    return this.hub.send(data, characteristic)
  }

  public subscribe(mode: number) {
    this._ensureConnected()
    if (mode !== this._mode) {
      this._mode = mode
      this.hub.subscribe({ portId: this.portId, mode })
    }
  }

  public unsubscribe() {
    this._ensureConnected()
  }

  public receive(message: Buffer) {
    this.notify('receive', { message })
  }

  public notify(event: string, values: Record<string, unknown>) {
    this.values[event] = values
    this.emit(event, values)
    if (this.hub.listenerCount(event) > 0) {
      this.hub.emit(event, this, values)
    }
  }

  public requestUpdate() {
    this.send(Buffer.from([0x21, this.portId, 0x00]))
  }

  public finish(message: number) {
    if ((message & 0x10) === 0x10) return // "busy/full"
    this._busy = (message & 0x01) === 0x01
    while (this._finishedCallbacks.length > Number(this._busy)) {
      const callback = this._finishedCallbacks.shift()
      if (callback) {
        callback()
      }
    }
  }

  public setEventTimer(timer: NodeJS.Timer) {
    this._eventTimer = timer
  }

  public cancelEventTimer() {
    if (this._eventTimer) {
      clearTimeout(this._eventTimer)
      this._eventTimer = null
    }
  }

  private _ensureConnected() {
    if (!this.connected) {
      throw new Error('Device is not connected')
    }
  }
}
