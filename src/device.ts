import { Characteristic, Peripheral, Service } from '@abandonware/noble'
import Debug from 'debug'
import { EventEmitter } from 'events'

import { IBLEAbstraction } from './interfaces.js'
const debug = Debug('device')

export class Device extends EventEmitter implements IBLEAbstraction {
  public readonly peripheral: Peripheral

  private _uuid: string
  private _name: string = ''

  private _characteristics: { [uuid: string]: Characteristic } = {}

  private _mailbox: Buffer[] = []

  private _connected: boolean = false
  private _connecting: boolean = false

  constructor(peripheral: Peripheral) {
    super()
    this.peripheral = peripheral
    this._uuid = peripheral.uuid
    peripheral.on('disconnect', () => {
      this._connecting = false
      this._connected = false
      this.emit('disconnect')
    })
    // NK: This hack allows LPF2.0 hubs to send a second advertisement packet consisting of the hub name before we try to read it
    setTimeout(() => {
      this._name = peripheral.advertisement.localName
      this.emit('discoverComplete')
    }, 1000)
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
    return new Promise<void>((resolve, reject) => {
      this._connecting = true
      this.peripheral.connect((err: string) => {
        if (err) {
          return reject(err)
        }

        this._connecting = false
        this._connected = true
        return resolve()
      })
    })
  }

  public disconnect() {
    return new Promise<void>((resolve) => {
      this.peripheral.disconnect()
      this._connecting = false
      this._connected = false
      return resolve()
    })
  }

  public discoverServices(uuid: string) {
    return new Promise<Service[]>((resolve, reject) => {
      this.peripheral.discoverServices(
        [uuid],
        (errorMessage: string | undefined, services: Service[]) => {
          if (errorMessage) {
            reject(new Error(errorMessage))
          }
          resolve(services)
        }
      )
    })
  }

  discoverCharacteristics(service: Service) {
    return new Promise<Characteristic[]>((resolve, reject) => {
      service.discoverCharacteristics([], (error, characteristics) => {
        if (error) {
          reject(error)
        }
        return resolve(characteristics)
      })
    })
  }

  public async discoverCharacteristicsForService(uuid: string) {
    const sanitizedUuid = this._sanitizeUUID(uuid)
    const services = await this.discoverServices(sanitizedUuid)

    debug('Service/characteristic discovery started')
    for (const service of services) {
      const characteristics = await this.discoverCharacteristics(service)
      characteristics.forEach((characteristic) => {
        this._characteristics[characteristic.uuid] = characteristic
      })
    }
    debug('Service/characteristic discovery finished')
  }

  public subscribeToCharacteristic(
    uuid: string,
    callback: (data: Buffer) => void
  ) {
    uuid = this._sanitizeUUID(uuid)
    this._characteristics[uuid].on('data', (data: Buffer) => {
      return callback(data)
    })
    this._characteristics[uuid].subscribe((err) => {
      if (err) {
        throw new Error(err)
      }
    })
  }

  public addToCharacteristicMailbox(uuid: string, data: Buffer) {
    this._mailbox.push(data)
  }

  public readFromCharacteristic(
    uuid: string,
    callback: (err: string | null, data: Buffer | null) => void
  ) {
    uuid = this._sanitizeUUID(uuid)
    this._characteristics[uuid].read((err: string, data: Buffer) => {
      return callback(err, data)
    })
  }

  public writeToCharacteristic(uuid: string, data: Buffer) {
    return new Promise<void>((resolve, reject) => {
      uuid = this._sanitizeUUID(uuid)
      this._characteristics[uuid].write(data, false, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve()
      })
    })
  }

  private _sanitizeUUID(uuid: string) {
    return uuid.replace(/-/g, '')
  }
}
