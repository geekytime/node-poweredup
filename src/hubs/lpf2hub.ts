import Debug from 'debug'

import * as Consts from '../consts.js'
import { createDeviceByType } from '../create-device-by-type.js'
import { DeviceId, DeviceName, deviceNamesById } from '../device-ids.js'
import { ServiceIds } from '../hub-type.js'
import { decodeMACAddress, decodeVersion, toBin, toHex } from '../utils.js'
import { BaseHub } from './basehub.js'

const debug = Debug('lpf2hub')
const modeInfoDebug = Debug('lpf2hubmodeinfo')

export class LPF2Hub extends BaseHub {
  private _messageBuffer: Buffer = Buffer.alloc(0)

  private _propertyRequestCallbacks: {
    [property: number]: (data: Buffer) => void
  } = {}

  public async connect() {
    debug('connecting...')
    await super.connect()
    await this.hubDevice.discoverCharacteristicsForService(ServiceIds.LPF2_HUB)
    this.hubDevice.subscribeToCharacteristic(
      Consts.BLECharacteristic.LPF2_ALL,
      this._parseMessage.bind(this)
    )
    await this._requestHubPropertyReports(
      Consts.HubPropertyPayload.BUTTON_STATE
    )
    await this._requestHubPropertyValue(Consts.HubPropertyPayload.FW_VERSION)
    await this._requestHubPropertyValue(Consts.HubPropertyPayload.HW_VERSION)
    await this._requestHubPropertyReports(Consts.HubPropertyPayload.RSSI)
    await this._requestHubPropertyReports(
      Consts.HubPropertyPayload.BATTERY_VOLTAGE
    )
    await this._requestHubPropertyValue(
      Consts.HubPropertyPayload.PRIMARY_MAC_ADDRESS
    )
    this.emit('connect', this)
    debug('...connected!')
  }

  public shutdown() {
    const message = Buffer.from([0x02, 0x01])
    return this.send({ message })
  }

  public async setName(name: string) {
    if (name.length > 14) {
      throw new Error('Name must be 14 characters or less')
    }
    const data = Buffer.from([0x01, 0x01, 0x01])
    const message = Buffer.concat([data, Buffer.from(name, 'ascii')])
    // Send this twice, as sometimes the first time doesn't take
    await this.send({ message })
    await this.send({ message })
    this._name = name
  }

  public writeDirect({
    portId,
    mode,
    data
  }: {
    portId: number
    mode: number
    data: Buffer
  }) {
    const message = Buffer.concat([
      Buffer.from([0x81, portId, 0x11, 0x51, mode]),
      data
    ])
    const characteristic = Consts.BLECharacteristic.LPF2_ALL
    return this.send({
      message,
      characteristic
    })
  }

  public send({
    message,
    characteristic = Consts.BLECharacteristic.LPF2_ALL
  }: {
    message: Buffer
    characteristic?: string
  }) {
    message = Buffer.concat([Buffer.alloc(2), message])
    message[0] = message.length
    debug('send', message)
    return this.hubDevice.writeToCharacteristic(characteristic, message)
  }

  public subscribe({ portId, mode }: { portId: number; mode: number }) {
    debug('subscribe', { portId, mode })
    const message = Buffer.from([
      0x41,
      portId,
      mode,
      0x01,
      0x00,
      0x00,
      0x00,
      0x01
    ])
    return this.send({ message })
  }

  public unsubscribe({ portId, mode }: { portId: number; mode: number }) {
    const message = Buffer.from([
      0x41,
      portId,
      mode,
      0x01,
      0x00,
      0x00,
      0x00,
      0x00
    ])
    return this.send({ message })
  }

  /**
   * Combines two ports into a single virtual port.
   *
   * Note: The devices attached to the ports must be of the same device type.
   * @method LPF2Hub#createVirtualPort
   * @param {string} firstPortName First port name
   * @param {string} secondPortName Second port name
   * @returns {Promise} Resolved upon successful issuance of command.
   */
  public createVirtualPort(firstPortName: string, secondPortName: string) {
    const firstDevice = this.getDeviceByPortName(firstPortName)
    if (!firstDevice) {
      throw new Error(`Port ${firstPortName} does not have an attached device`)
    }
    const secondDevice = this.getDeviceByPortName(secondPortName)
    if (!secondDevice) {
      throw new Error(`Port ${secondPortName} does not have an attached device`)
    }
    if (firstDevice.type !== secondDevice.type) {
      throw new Error(
        `Both devices must be of the same type to create a virtual port`
      )
    }

    const message = Buffer.from([
      0x61,
      0x01,
      firstDevice.portId,
      secondDevice.portId
    ])
    return this.send({ message })
  }

  protected _checkFirmware(_version: string) {
    return
  }

  private _parseMessage(data?: Buffer) {
    if (data) {
      this._messageBuffer = Buffer.concat([this._messageBuffer, data])
    }

    if (this._messageBuffer.length <= 0) {
      return
    }

    const len = this._messageBuffer[0]
    if (len <= this._messageBuffer.length) {
      const message = this._messageBuffer.slice(0, len)
      this._messageBuffer = this._messageBuffer.slice(len)

      const messageType = message[2]
      debug('received messageType', messageType)

      switch (messageType) {
        case Consts.MessageType.HUB_PROPERTIES: {
          const property = message[3]
          const callback = this._propertyRequestCallbacks[property]
          if (callback) {
            callback(message)
          } else {
            this._parseHubPropertyResponse(message)
          }
          delete this._propertyRequestCallbacks[property]
          break
        }
        case Consts.MessageType.HUB_ATTACHED_IO: {
          this._parsePortMessage(message)
          break
        }
        case Consts.MessageType.PORT_INFORMATION: {
          this._parsePortInformationResponse(message)
          break
        }
        case Consts.MessageType.PORT_MODE_INFORMATION: {
          this._parseModeInformationResponse(message)
          break
        }
        case Consts.MessageType.PORT_VALUE_SINGLE: {
          this._parseSensorMessage(message)
          break
        }
        case Consts.MessageType.PORT_OUTPUT_COMMAND_FEEDBACK: {
          this._parsePortAction(message)
          break
        }
      }

      if (this._messageBuffer.length > 0) {
        this._parseMessage()
      }
    }
  }

  private _requestHubPropertyValue(property: number) {
    return new Promise<void>((resolve) => {
      this._propertyRequestCallbacks[property] = (message) => {
        this._parseHubPropertyResponse(message)
        return resolve()
      }
      const message = Buffer.from([0x01, property, 0x05])
      this.send({ message })
    })
  }

  private _requestHubPropertyReports(property: number) {
    const message = Buffer.from([0x01, property, 0x02])
    return { message }
  }

  private _parseHubPropertyResponse(message: Buffer) {
    if (message[3] === Consts.HubPropertyPayload.BUTTON_STATE) {
      if (message[5] === 1) {
        /**
         * Emits when a button is pressed.
         * @event LPF2Hub#button
         * @param {string} button
         * @param {ButtonState} state
         */
        this.emit('button', { event: Consts.ButtonState.PRESSED })
        return
      } else if (message[5] === 0) {
        this.emit('button', { event: Consts.ButtonState.RELEASED })
        return
      }
    } else if (message[3] === Consts.HubPropertyPayload.FW_VERSION) {
      this._firmwareVersion = decodeVersion(message.readInt32LE(5))
      this._checkFirmware(this._firmwareVersion)
    } else if (message[3] === Consts.HubPropertyPayload.HW_VERSION) {
      this._hardwareVersion = decodeVersion(message.readInt32LE(5))
    } else if (message[3] === Consts.HubPropertyPayload.RSSI) {
      const rssi = message.readInt8(5)
      if (rssi !== 0) {
        this._rssi = rssi
        this.emit('rssi', { rssi: this._rssi })
      }
    } else if (message[3] === Consts.HubPropertyPayload.PRIMARY_MAC_ADDRESS) {
      this._primaryMACAddress = decodeMACAddress(message.slice(5))
    } else if (message[3] === Consts.HubPropertyPayload.BATTERY_VOLTAGE) {
      const batteryLevel = message[5]
      if (batteryLevel !== this._batteryLevel) {
        this._batteryLevel = batteryLevel
        this.emit('batteryLevel', { batteryLevel })
      }
    }
  }

  private async _parsePortMessage(message: Buffer) {
    const portId = message[3]
    const event = message[4]
    const maybeDeviceId = message.readUInt16LE(5) as DeviceId
    const deviceId: DeviceId = event ? maybeDeviceId : 0

    debug('port message', { portId, event, deviceId })

    if (event === Consts.Event.ATTACHED_IO) {
      if (modeInfoDebug.enabled) {
        const deviceName =
          deviceNamesById[message[5]] || ('Unknown' as DeviceName)
        modeInfoDebug(
          `Port ${toHex(portId)}, type ${toHex(deviceId, 4)} (${deviceName})`
        )
        const hwVersion = decodeVersion(message.readInt32LE(7))
        const swVersion = decodeVersion(message.readInt32LE(11))
        modeInfoDebug(
          `Port ${toHex(
            portId
          )}, hardware version ${hwVersion}, software version ${swVersion}`
        )
        await this._sendPortInformationRequest(portId)
      }

      const device = createDeviceByType({
        hub: this,
        deviceNumber: deviceId,
        portId
      })
      this.attachDevice(device)
    } else if (event === Consts.Event.DETACHED_IO) {
      const device = this.getDeviceByPortId(portId)
      if (device) {
        this._detachDevice(device)
        if (this.isPortVirtual(portId)) {
          const portName = this.getPortNameForPortId(portId)
          if (portName) {
            delete this._portMap[portName]
          }
          this._virtualPorts = this._virtualPorts.filter(
            (virtualPortId) => virtualPortId !== portId
          )
        }
      }
    } else if (event === Consts.Event.ATTACHED_VIRTUAL_IO) {
      const firstPortName = this.getPortNameForPortId(message[7])
      const secondPortName = this.getPortNameForPortId(message[8])
      const virtualPortName = firstPortName! + secondPortName!
      const virtualPortId = message[3]
      this._portMap[virtualPortName] = virtualPortId
      this._virtualPorts.push(virtualPortId)
      const device = createDeviceByType({
        hub: this,
        deviceNumber: deviceId,
        portId: virtualPortId
      })
      this.attachDevice(device)
    }
  }

  private async _sendPortInformationRequest(port: number) {
    // HACK: What is this message?
    const message1 = Buffer.from([0x21, port, 0x01])
    await this.send({ message: message1 })

    const modeCombinationsMessage = Buffer.from([0x21, port, 0x02])
    await this.send({ message: modeCombinationsMessage })
  }

  private async _parsePortInformationResponse(message: Buffer) {
    const port = message[3]
    if (message[4] === 2) {
      const modeCombinationMasks: number[] = []
      for (let i = 5; i < message.length; i += 2) {
        modeCombinationMasks.push(message.readUInt16LE(i))
      }
      modeInfoDebug(
        `Port ${toHex(port)}, mode combinations [${modeCombinationMasks
          .map((c) => toBin(c, 0))
          .join(', ')}]`
      )
      return
    }
    const count = message[6]
    const input = toBin(message.readUInt16LE(7), count)
    const output = toBin(message.readUInt16LE(9), count)
    modeInfoDebug(
      `Port ${toHex(
        port
      )}, total modes ${count}, input modes ${input}, output modes ${output}`
    )

    for (let i = 0; i < count; i++) {
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.NAME
      )
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.RAW
      )
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.PCT
      )
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.SI
      )
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.SYMBOL
      )
      await this._sendModeInformationRequest(
        port,
        i,
        Consts.ModeInformationType.VALUE_FORMAT
      )
    }
  }

  private _sendModeInformationRequest(
    port: number,
    mode: number,
    type: number
  ) {
    const message = Buffer.from([0x22, port, mode, type])
    return this.send({ message })
  }

  private _parseModeInformationResponse(message: Buffer) {
    const port = toHex(message[3])
    const mode = message[4]
    const type = message[5]
    if (type === Consts.ModeInformationType.NAME) {
      modeInfoDebug(
        `Port ${port}, mode ${mode}, name ${message
          .slice(6, message.length)
          .toString()}`
      )
    } else if (type === Consts.ModeInformationType.RAW) {
      modeInfoDebug(
        `Port ${port}, mode ${mode}, RAW min ${message.readFloatLE(
          6
        )}, max ${message.readFloatLE(10)}`
      )
    } else if (type === Consts.ModeInformationType.PCT) {
      modeInfoDebug(
        `Port ${port}, mode ${mode}, PCT min ${message.readFloatLE(
          6
        )}, max ${message.readFloatLE(10)}`
      )
    } else if (type === Consts.ModeInformationType.SI) {
      modeInfoDebug(
        `Port ${port}, mode ${mode}, SI min ${message.readFloatLE(
          6
        )}, max ${message.readFloatLE(10)}`
      )
    } else if (type === Consts.ModeInformationType.SYMBOL) {
      modeInfoDebug(
        `Port ${port}, mode ${mode}, SI symbol ${message
          .slice(6, message.length)
          .toString()}`
      )
    } else if (type === Consts.ModeInformationType.VALUE_FORMAT) {
      const numValues = message[6]
      const dataType = ['8bit', '16bit', '32bit', 'float'][message[7]]
      const totalFigures = message[8]
      const decimals = message[9]
      modeInfoDebug(
        `Port ${port}, mode ${mode}, Value ${numValues} x ${dataType}, Decimal format ${totalFigures}.${decimals}`
      )
    }
  }

  private _parsePortAction(message: Buffer) {
    for (let offset = 3; offset < message.length; offset += 2) {
      const device = this.getDeviceByPortId(message[offset])

      if (device) {
        device.finish(message[offset + 1])
      }
    }
  }

  private _parseSensorMessage(message: Buffer) {
    const portId = message[3]
    const device = this.getDeviceByPortId(portId)

    if (device) {
      device.receive(message)
    }
  }
}
