import { Peripheral } from '@abandonware/noble'
import noble from '@abandonware/noble'
import Debug from 'debug'
import { EventEmitter } from 'events'

import { Device } from './device.js'
import { ServiceIds } from './hub-type.js'
import { BaseHub } from './hubs/basehub.js'
import { Hub } from './hubs/hub.js'

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

  private ready = false
  private wantScan = false

  constructor() {
    super()
    noble.on('discover', this.handleDiscovery)
    noble.on('stateChange', this.handleNobleStateChange)
    noble.on('scanStop', this.handleNobleStopScan)
  }

  private handleNobleStateChange = (nobleState: string) => {
    this.ready = nobleState === 'poweredOn'

    if (this.ready) {
      if (this.wantScan) {
        debug('Scanning started')
        this.nobleStartScanning()
      } else {
        noble.stopScanning()
      }
    }
  }

  private handleNobleStopScan = () => {
    setTimeout(() => {
      this.nobleStartScanning()
    }, 1000)
  }

  private nobleStartScanning = () => {
    noble.startScanningAsync([
      ServiceIds.LPF2_HUB,
      ServiceIds.LPF2_HUB.replace(/-/g, ''),
      ServiceIds.WEDO2_SMART_HUB,
      ServiceIds.WEDO2_SMART_HUB.replace(/-/g, '')
    ])
  }

  public async scan() {
    this.wantScan = true

    if (this.ready) {
      debug('Scanning started')
      this.nobleStartScanning()
    }

    return true
  }

  public stop() {
    this.wantScan = false
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
    const device = new Device(peripheral)

    const hub = Hub.fromDevice(device)

    device.on('discoverComplete', () => {
      hub.on('connect', () => {
        debug(`Hub ${hub.uuid} connected`)
        this._connectedHubs[hub.uuid] = hub
      })

      hub.on('disconnect', () => {
        debug(`Hub ${hub.uuid} disconnected`)
        delete this._connectedHubs[hub.uuid]

        if (this.wantScan) {
          this.nobleStartScanning()
        }
      })

      debug(`Hub ${hub.uuid} discovered`)

      this.emit('discover', hub)
    })
  }
}
