import { Characteristic, Peripheral, Service } from '@abandonware/noble'
import Debug from 'debug'
import { EventEmitter } from 'events'

import { sanitizeUUID, waitFor } from './utils.js'

const debug = Debug('device')

export type ConnectionState = 'disconnected' | 'connecting' | 'connected'

export class HubDevice extends EventEmitter {
  public readonly peripheral: Peripheral

  private _characteristics: { [uuid: string]: Characteristic } = {}

  private _mailbox: Buffer[] = []

  private connectionState: ConnectionState = 'disconnected'

  private constructor(peripheral: Peripheral) {
    super()
    this.peripheral = peripheral

    peripheral.on('disconnect', () => {
      this.connectionState = 'disconnected'
      this.emit('disconnect')
    })
  }

  public static async create(peripheral: Peripheral) {
    const device = new HubDevice(peripheral)
    // HACK: this allows LPF2.0 hubs to send a second advertisement packet
    // consisting of the hub name before we try to read it
    await device.hasName()
    return device
  }

  public get uuid() {
    return this.peripheral.uuid
  }

  public get name() {
    return this.peripheral.advertisement?.localName
  }

  public async hasName() {
    const name = this.name
    if (name) {
      return name
    }
    return await waitFor({
      timeoutMS: 1000,
      retryMS: 20,
      checkFn: () => !!this.name
    })
  }

  public get connecting() {
    return this.connectionState === 'connecting'
  }

  public get connected() {
    return this.connectionState === 'connected'
  }

  public connect() {
    return new Promise<void>((resolve, reject) => {
      this.connectionState = 'connecting'
      this.peripheral.connect((err: string) => {
        if (err) {
          return reject(err)
        }

        this.connectionState = 'connected'
        return resolve()
      })
    })
  }

  public disconnect() {
    return new Promise<void>((resolve) => {
      this.peripheral.disconnect()
      this.connectionState = 'disconnected'
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
    const sanitizedUuid = sanitizeUUID(uuid)
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
    uuid = sanitizeUUID(uuid)
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
    uuid = sanitizeUUID(uuid)
    this._characteristics[uuid].read((err: string, data: Buffer) => {
      return callback(err, data)
    })
  }

  public writeToCharacteristic(uuid: string, data: Buffer) {
    return new Promise<void>((resolve, reject) => {
      uuid = sanitizeUUID(uuid)
      this._characteristics[uuid].write(data, false, (error) => {
        if (error) {
          return reject(error)
        }

        return resolve()
      })
    })
  }
}
