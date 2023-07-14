import Debug from 'debug'
import { EventEmitter } from 'events'

import { IBLEAbstraction } from './interfaces.js'
const debug = Debug('bledevice')

export class WebBLEDevice extends EventEmitter implements IBLEAbstraction {
  private _webBLEServer: BluetoothRemoteGATTServer

  private _uuid: string
  private _name: string = ''

  private _listeners: {
    [uuid: string]: EventListenerOrEventListenerObject
  } = {}
  private _characteristics: {
    [uuid: string]: BluetoothRemoteGATTCharacteristic
  } = {}

  private _queue: Promise<void> = Promise.resolve()
  private _mailbox: Buffer[] = []

  private _connected: boolean = false
  private _connecting: boolean = false

  constructor(device: BluetoothRemoteGATTServer) {
    super()
    this._webBLEServer = device
    this._uuid = device.device.id
    this._name = device.device.name || '<Unknown Device>'
    device.device.addEventListener('gattserverdisconnected', () => {
      this._connecting = false
      this._connected = false
      this.emit('disconnect')
    })
    setTimeout(() => {
      this.emit('discoverComplete')
    }, 2000)
  }

  public get uuid() {
    return this._uuid
  }

  public get name() {
    return this._name
  }

  public get connecting() {
    return this._connecting
  }

  public get connected() {
    return this._connected
  }

  public connect() {
    return new Promise<void>((resolve) => {
      this._connected = true
      return resolve()
    })
  }

  public disconnect() {
    return new Promise<void>((resolve) => {
      this._webBLEServer.device.gatt?.disconnect()
      this._connected = false
      return resolve()
    })
  }

  public async discoverCharacteristicsForService(uuid: string) {
    debug('Service/characteristic discovery started')
    const service = await this._webBLEServer.getPrimaryService(uuid)
    const characteristics = await service.getCharacteristics()
    for (const characteristic of characteristics) {
      this._characteristics[characteristic.uuid] = characteristic
    }
    debug('Service/characteristic discovery finished')
  }

  public subscribeToCharacteristic(
    uuid: string,
    callback: (data: Buffer) => void
  ) {
    if (this._listeners[uuid]) {
      this._characteristics[uuid].removeEventListener(
        'characteristicvaluechanged',
        this._listeners[uuid]
      )
    }
    this._listeners[uuid] = (event) => {
      // @ts-expect-error - Bluetooth types are too generic
      const buf = Buffer.alloc(event.target?.value.buffer.byteLength)
      // @ts-expect-error - Bluetooth types are too generic
      const view = new Uint8Array(event.target?.value.buffer)
      for (let i = 0; i < buf.length; i++) {
        buf[i] = view[i]
      }
      debug('Incoming data', buf)
      return callback(buf)
    }
    this._characteristics[uuid].addEventListener(
      'characteristicvaluechanged',
      this._listeners[uuid]
    )

    const mailbox = Array.from(this._mailbox)
    this._mailbox = []
    for (const data of mailbox) {
      debug('Replayed from mailbox (LPF2_ALL)', data)
      callback(data)
    }

    this._characteristics[uuid].startNotifications()
  }

  public addToCharacteristicMailbox(uuid: string, data: Buffer) {
    this._mailbox.push(data)
  }

  public readFromCharacteristic(
    uuid: string,
    callback: (err: string | null, data: Buffer | null) => void
  ) {
    this._characteristics[uuid].readValue().then((data) => {
      const buf = Buffer.alloc(data.buffer.byteLength)
      const view = new Uint8Array(data.buffer)
      for (let i = 0; i < buf.length; i++) {
        buf[i] = view[i]
      }
      callback(null, buf)
    })
  }

  public writeToCharacteristic(uuid: string, data: Buffer) {
    return (this._queue = this._queue.then(() =>
      this._characteristics[uuid].writeValueWithoutResponse(data)
    ))
  }

  private _sanitizeUUID(uuid: string) {
    return uuid.replace(/-/g, '')
  }
}
