import { Peripheral } from '@abandonware/noble'
import noble from '@abandonware/noble'
import Debug from 'debug'
import { EventEmitter } from 'events'

import { Device } from './device.js'
import { ServiceIds } from './hub-type.js'
import { BaseHub } from './hubs/basehub.js'
import { Hub } from './hubs/hub.js'

const debug = Debug('poweredup')
let ready = false
let wantScan = false

const startScanning = () => {
  noble.startScanningAsync([
    ServiceIds.LPF2_HUB,
    ServiceIds.LPF2_HUB.replace(/-/g, ''),
    ServiceIds.WEDO2_SMART_HUB,
    ServiceIds.WEDO2_SMART_HUB.replace(/-/g, '')
  ])
}

noble.on('stateChange', (state: string) => {
  ready = state === 'poweredOn'
  if (ready) {
    if (wantScan) {
      debug('Scanning started')
      startScanning()
    }
    noble.on('scanStop', () => {
      setTimeout(() => {
        startScanning()
      }, 1000)
    })
  } else {
    noble.stopScanning()
  }
})

/**
 * @class PoweredUP
 * @extends EventEmitter
 */
export class PoweredUP extends EventEmitter {
  private _connectedHubs: { [uuid: string]: BaseHub } = {}

  /**
   * Begin scanning for Powered UP Hub devices.
   * @method PoweredUP#scan
   */
  public async scan() {
    wantScan = true
    noble.on('discover', this.onDiscovery)

    if (ready) {
      debug('Scanning started')
      startScanning()
    }

    return true
  }

  /**
   * Stop scanning for Powered UP Hub devices.
   * @method PoweredUP#stop
   */
  public stop() {
    wantScan = false
    noble.removeListener('discover', this.onDiscovery)
    noble.stopScanning()
  }

  /**
   * Retrieve a list of Powered UP Hubs.
   * @method PoweredUP#getHubs
   * @returns {BaseHub[]}
   */
  public getHubs() {
    return Object.values(this._connectedHubs)
  }

  /**
   * Retrieve a Powered UP Hub by UUID.
   * @method PoweredUP#getHubByUUID
   * @param {string} uuid
   * @returns {BaseHub | null}
   */
  public getHubByUUID(uuid: string) {
    return this._connectedHubs[uuid]
  }

  /**
   * Retrieve a Powered UP Hub by primary MAC address.
   * @method PoweredUP#getHubByPrimaryMACAddress
   * @param {string} address
   * @returns {BaseHub}
   */
  public getHubByPrimaryMACAddress(address: string) {
    return Object.values(this._connectedHubs).filter(
      (hub) => hub.primaryMACAddress === address
    )[0]
  }

  /**
   * Retrieve a list of Powered UP Hub by name.
   * @method PoweredUP#getHubsByName
   * @param {string} name
   * @returns {BaseHub[]}
   */
  public getHubsByName(name: string) {
    return Object.values(this._connectedHubs).filter((hub) => hub.name === name)
  }

  /**
   * Retrieve a list of Powered UP Hub by type.
   * @method PoweredUP#getHubsByType
   * @param {string} name
   * @returns {BaseHub[]}
   */
  public getHubsByType(hubType: number) {
    return Object.values(this._connectedHubs).filter(
      (hub) => hub.type === hubType
    )
  }

  private onDiscovery = async (peripheral: Peripheral) => {
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

        if (wantScan) {
          startScanning()
        }
      })

      debug(`Hub ${hub.uuid} discovered`)

      /**
       * Emits when a Powered UP Hub device is found.
       * @event PoweredUP#discover
       * @param {WeDo2SmartHub | MoveHub | TechnicMediumHub | RemoteControl | DuploTrainBase} hub
       */
      this.emit('discover', hub)
    })
  }
}
