export const deviceIdsByName = {
  Unknown: 0,
  SimpleMediumLinearMotor: 1,
  TrainMotor: 2,
  Light: 8,
  VoltageSensor: 20,
  CurrentSensor: 21,
  PiezoBuzzer: 22,
  HubLed: 23,
  TiltSensor: 34,
  MotionSensor: 35,
  ColorDistanceSensor: 37,
  MediumLinearMotor: 38,
  MoveHubMediumLinearMotor: 39,
  MoveHubTiltSensor: 40,
  DuploTrainBaseMotor: 41,
  DuploTrainBaseSpeaker: 42,
  DuploTrainBaseColorSensor: 43,
  DuploTrainBaseSpeedometer: 44,
  TechnicLargeLinearMotor: 46, // Technic Control+
  TechnicXLargeLinearMotor: 47, // Technic Control+
  TechnicMediumAngularMotor: 48, // Spike Prime
  TechnicLargeAngularMotor: 49, // Spike Prime
  TechnicMediumHubGestSensor: 54,
  RemoteControlButton: 55,
  RemoteControlRssi: 56,
  TechnicMediumHubAccelerometer: 57,
  TechnicMediumHubGyroSensor: 58,
  TechnicMediumHubTiltSensor: 59,
  TechnicMediumHubTemperatureSensor: 60,
  TechnicColorSensor: 61, // Spike Prime
  TechnicDistanceSensor: 62, // Spike Prime
  TechnicForceSensor: 63, // Spike Prime
  Technic3x3ColorLightMatrix: 64, // Spike Essential
  TechnicSmallAngularMotor: 65, // Spike Essential
  MarioAccelerometer: 71,
  MarioBarcodeSensor: 73,
  MarioPantsSensor: 74,
  TechnicMediumAngularMotorGrey: 75, // Mindstorms
  TechnicLargeAngularMotorGrey: 76 // Technic Control+
} as const

export type DeviceName = keyof typeof deviceIdsByName
export type DeviceId = (typeof deviceIdsByName)[keyof typeof deviceIdsByName]
export const deviceNames = Object.keys(deviceIdsByName) as DeviceName[]
export const deviceIds = Object.values(deviceIdsByName) as DeviceId[]

export const deviceNamesById = Object.entries(deviceIdsByName).reduce(
  (acc, [name, id]) => {
    acc[id] = name
    return acc
  },
  {} as Record<DeviceName, DeviceId>
)
