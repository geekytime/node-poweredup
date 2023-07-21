import { Peripheral } from '@abandonware/noble'
import noble from '@abandonware/noble'
import Debug from 'debug'
import { EventEmitter } from 'events'

import { ServiceIds } from './hub-type.js'
import { BaseHub } from './hubs/basehub.js'
import { Hub } from './hubs/hub.js'
import { sanitizeUUID, waitFor } from './utils.js'

const debug = Debug('scanner')

export type NobleState = 'poweredOn'

export type ScannerState =
  | 'unknown'
  | 'ready'
  | 'paused'
  | 'waiting'
  | 'stopped'

export class Scanner extends EventEmitter {
  private _connectedHubs = new Map<string, BaseHub>()

  constructor() {
    super()
    noble.on('discover', this.handleDiscovery)
  }

  public static async create() {
    await Scanner.nobleInit()
    return new Scanner()
  }

  private static nobleInit = async () => {
    await waitFor({
      timeoutMS: 10000,
      retryMS: 50,
      checkFn: Scanner.nobleIsPoweredOn
    })
  }

  private static nobleIsPoweredOn = async () => {
    return noble.state === 'poweredOn'
  }

  private nobleStartScanning = () => {
    debug('nobleStartScanning')
    noble.startScanningAsync([
      ServiceIds.LPF2_HUB,
      sanitizeUUID(ServiceIds.LPF2_HUB),
      ServiceIds.WEDO2_SMART_HUB,
      sanitizeUUID(ServiceIds.WEDO2_SMART_HUB)
    ])
  }

  public async scan() {
    debug('scan')
    this.nobleStartScanning()
    return true
  }

  public connectToHub(): Promise<Hub> {
    debug('connectToHub')
    return new Promise((resolve, reject) => {
      this.once('discover', async (hub: Hub) => {
        try {
          debug(`hub discovered: ${hub.name}`)
          await hub.connect()
          resolve(hub)
        } catch (error) {
          reject(error)
        }
      })
      this.scan()
    })
  }

  public stop() {
    noble.removeListener('discover', this.handleDiscovery)
    noble.stopScanning()
  }

  public get connectedHubs() {
    return Object.values(this._connectedHubs)
  }

  public getHubByUUID(uuid: string) {
    return this._connectedHubs[uuid]
  }

  public getHubByPrimaryMACAddress(address: string) {
    return Object.values(this._connectedHubs).filter(
      (hub) => hub.primaryMACAddress === address
    )[0]
  }

  public getHubsByName(name: string) {
    return Object.values(this._connectedHubs).filter((hub) => hub.name === name)
  }

  public getHubsByType(hubType: number) {
    return Object.values(this._connectedHubs).filter(
      (hub) => hub.type === hubType
    )
  }

  private handleDiscovery = async (peripheral: Peripheral) => {
    peripheral.removeAllListeners()

    const hub = await Hub.fromPeripheral(peripheral)
    hub.on('connect', this.handleHubConnect)
    hub.on('disconnect', this.handleHubDisconnect)

    debug(`Hub ${hub.uuid} discovered`)
    this.emit('discover', hub)
  }

  private handleHubConnect = (hub: Hub) => {
    debug(`Hub ${hub.uuid} connected`)
    this._connectedHubs[hub.uuid] = hub
  }

  private handleHubDisconnect = (hub: Hub) => {
    debug(`Hub ${hub.uuid} disconnected`)
    delete this._connectedHubs[hub.uuid]

    this.nobleStartScanning()
  }
}
