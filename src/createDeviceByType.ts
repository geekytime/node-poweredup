import { DeviceNumber } from './device-type.js'
import { ColorDistanceSensor } from './devices/colordistancesensor.js'
import { CurrentSensor } from './devices/currentsensor.js'
import { DuploTrainBaseColorSensor } from './devices/duplotrainbasecolorsensor.js'
import { DuploTrainBaseMotor } from './devices/duplotrainbasemotor.js'
import { DuploTrainBaseSpeaker } from './devices/duplotrainbasespeaker.js'
import { DuploTrainBaseSpeedometer } from './devices/duplotrainbasespeedometer.js'
import { HubLED } from './devices/hubled.js'
import { Light } from './devices/light.js'
import { MarioAccelerometer } from './devices/marioaccelerometer.js'
import { MarioBarcodeSensor } from './devices/mariobarcodesensor.js'
import { MarioPantsSensor } from './devices/mariopantssensor.js'
import { MediumLinearMotor } from './devices/mediumlinearmotor.js'
import { MotionSensor } from './devices/motionsensor.js'
import { MoveHubMediumLinearMotor } from './devices/movehubmediumlinearmotor.js'
import { MoveHubTiltSensor } from './devices/movehubtiltsensor.js'
import { PiezoBuzzer } from './devices/piezobuzzer.js'
import { RemoteControlButton } from './devices/remotecontrolbutton.js'
import { SimpleMediumLinearMotor } from './devices/simplemediumlinearmotor.js'
import { Technic3x3ColorLightMatrix } from './devices/technic3x3colorlightmatrix.js'
import { TechnicColorSensor } from './devices/techniccolorsensor.js'
import { TechnicDistanceSensor } from './devices/technicdistancesensor.js'
import { TechnicForceSensor } from './devices/technicforcesensor.js'
import { TechnicLargeAngularMotor } from './devices/techniclargeangularmotor.js'
import { TechnicLargeLinearMotor } from './devices/techniclargelinearmotor.js'
import { TechnicMediumAngularMotor } from './devices/technicmediumangularmotor.js'
import { TechnicMediumHubAccelerometerSensor } from './devices/technicmediumhubaccelerometersensor.js'
import { TechnicMediumHubGyroSensor } from './devices/technicmediumhubgyrosensor.js'
import { TechnicMediumHubTiltSensor } from './devices/technicmediumhubtiltsensor.js'
import { TechnicSmallAngularMotor } from './devices/technicsmallangularmotor.js'
import { TechnicXLargeLinearMotor } from './devices/technicxlargelinearmotor.js'
import { TiltSensor } from './devices/tiltsensor.js'
import { TrainMotor } from './devices/trainmotor.js'
import {
  UnknownDevice as Unknown,
  UnknownDevice
} from './devices/unknown-device.js'
import { VoltageSensor } from './devices/voltagesensor.js'
import { BaseHub } from './hubs/basehub.js'

const constructorsByNumber = {
  0: Unknown,
  1: SimpleMediumLinearMotor,
  2: TrainMotor,
  8: Light,
  20: VoltageSensor,
  21: CurrentSensor,
  22: PiezoBuzzer,
  23: HubLED,
  34: TiltSensor,
  35: MotionSensor,
  37: ColorDistanceSensor,
  38: MediumLinearMotor,
  39: MoveHubMediumLinearMotor,
  40: MoveHubTiltSensor,
  41: DuploTrainBaseMotor,
  42: DuploTrainBaseSpeaker,
  43: DuploTrainBaseColorSensor,
  44: DuploTrainBaseSpeedometer,
  46: TechnicLargeLinearMotor,
  47: TechnicXLargeLinearMotor,
  48: TechnicMediumAngularMotor,
  49: TechnicLargeAngularMotor,
  // 54: TechnicMediumHubGestSensor,
  55: RemoteControlButton,
  56: RemoteControlButton,
  57: TechnicMediumHubAccelerometerSensor,
  58: TechnicMediumHubGyroSensor,
  59: TechnicMediumHubTiltSensor,
  // 60: TechnicMediumHubTemperatureSensor,
  61: TechnicColorSensor,
  62: TechnicDistanceSensor,
  63: TechnicForceSensor,
  64: Technic3x3ColorLightMatrix,
  65: TechnicSmallAngularMotor,
  71: MarioAccelerometer,
  73: MarioBarcodeSensor,
  74: MarioPantsSensor,
  75: TechnicMediumAngularMotor,
  76: TechnicLargeAngularMotor
}

export const createDeviceByType = ({
  hub,
  deviceNumber,
  portId
}: {
  hub: BaseHub
  deviceNumber: DeviceNumber
  portId: number
}) => {
  const Constructor = constructorsByNumber[deviceNumber]
  if (!Constructor) {
    return new UnknownDevice(hub, portId, deviceNumber)
  }
  const device = new Constructor(hub, portId, deviceNumber)
  device.initEvents()
  return device
}
