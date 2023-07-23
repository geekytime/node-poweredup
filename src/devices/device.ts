import Debug from 'debug'
import { EventEmitter } from 'events'

import * as Consts from '../consts.js'
import { DeviceId, deviceNamesById } from '../device-ids.js'
import { BaseHub } from '../hubs/basehub.js'

const debug = Debug('device')

export type DeviceConnectionState = 'connected' | 'disconnected'

export abstract class Device extends EventEmitter {
  autoSubscribe: boolean = true
  values: Record<string, unknown> = {}

  protected mode: number | undefined
  protected busy: boolean = false
  protected _finishedCallbacks: (() => void)[] = []

  hub: BaseHub
  portId: number
  connectionState: DeviceConnectionState
  deviceId: DeviceId

  isWeDo2SmartHub: boolean
  isVirtualPort: boolean = false
  private eventTimer: NodeJS.Timer | null = null

  abstract get modes(): Record<string, number>

  constructor(hub: BaseHub, portId: number, type: DeviceId) {
    super()
    this.connectionState = 'connected'
    this.hub = hub
    this.portId = portId
    this.deviceId = type
    this.isWeDo2SmartHub = this.hub.type === Consts.HubType.WEDO2_SMART_HUB
    this.isVirtualPort = this.hub.isPortVirtual(portId)
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
      this.connectionState = 'disconnected'
      this.hub.removeListener('detach', this.handleDetach)
      this.emit('detach')
    }
  }

  public get connected() {
    return this.connectionState === 'connected'
  }

  public get portName() {
    return this.hub.getPortNameForPortId(this.portId)
  }

  public get type() {
    return this.deviceId
  }

  public get typeName() {
    return deviceNamesById[this.type]
  }

  public writeDirect({ mode, data }: { mode: number; data: Buffer }) {
    this.hub.writeDirect({
      portId: this.portId,
      mode,
      data
    })
  }

  public send({
    message,
    characteristic = Consts.BLECharacteristic.LPF2_ALL
  }: {
    message: Buffer
    characteristic?: string
  }) {
    this.hub.send({
      message,
      characteristic
    })
  }

  public subscribe(mode: number) {
    this.assertConnected()
    if (mode !== this.mode) {
      this.mode = mode
      this.hub.subscribe({ portId: this.portId, mode })
    }
  }

  public unsubscribe() {
    this.assertConnected()
  }

  public receive(message: Buffer) {
    debug('receive', message)
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
    const message = Buffer.from([0x21, this.portId, 0x00])
    this.hub.send({
      message,
      // HACK: Should we really be assuming this characteristic is always LPF2_ALL?
      characteristic: Consts.BLECharacteristic.LPF2_ALL
    })
  }

  public finish(message: number) {
    if ((message & 0x10) === 0x10) return // "busy/full"
    this.busy = (message & 0x01) === 0x01
    while (this._finishedCallbacks.length > Number(this.busy)) {
      const callback = this._finishedCallbacks.shift()
      if (callback) {
        callback()
      }
    }
  }

  public setEventTimer(timer: NodeJS.Timer) {
    this.eventTimer = timer
  }

  public cancelEventTimer() {
    if (this.eventTimer) {
      clearTimeout(this.eventTimer)
      this.eventTimer = null
    }
  }

  private assertConnected() {
    if (!this.connected) {
      throw new Error('Device is not connected')
    }
  }
}
