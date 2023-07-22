export enum HubType {
  UNKNOWN = 0,
  WEDO2_SMART_HUB = 1,
  MOVE_HUB = 2,
  HUB = 3,
  REMOTE_CONTROL = 4,
  DUPLO_TRAIN_BASE = 5,
  TECHNIC_MEDIUM_HUB = 6,
  MARIO = 7,
  TECHNIC_SMALL_HUB = 8
}

export const HubTypeNames = HubType

export enum Color {
  BLACK = 0,
  PINK = 1,
  PURPLE = 2,
  BLUE = 3,
  LIGHT_BLUE = 4,
  CYAN = 5,
  GREEN = 6,
  YELLOW = 7,
  ORANGE = 8,
  RED = 9,
  WHITE = 10,
  NONE = 255
}

export const ColorNames = Color

export enum ButtonState {
  PRESSED = 2,
  RELEASED = 0,
  UP = 1,
  DOWN = 255,
  STOP = 127
}

export enum BrakingStyle {
  FLOAT = 0,
  HOLD = 126,
  BRAKE = 127
}

export enum DuploTrainBaseSound {
  BRAKE = 3,
  STATION_DEPARTURE = 5,
  WATER_REFILL = 7,
  HORN = 9,
  STEAM = 10
}

export enum BLECharacteristic {
  WEDO2_BATTERY = '2a19',
  WEDO2_FIRMWARE_REVISION = '2a26',
  WEDO2_BUTTON = '00001526-1212-efde-1523-785feabcd123', // "1526"
  WEDO2_PORT_TYPE = '00001527-1212-efde-1523-785feabcd123', // "1527" // Handles plugging and unplugging of devices on WeDo 2.0 Smart Hub
  WEDO2_LOW_VOLTAGE_ALERT = '00001528-1212-efde-1523-785feabcd123', // "1528"
  WEDO2_HIGH_CURRENT_ALERT = '00001529-1212-efde-1523-785feabcd123', // "1529"
  WEDO2_LOW_SIGNAL_ALERT = '0000152a-1212-efde-1523-785feabcd123', // "152a",
  WEDO2_DISCONNECT = '0000152b-1212-efde-1523-785feabcd123', // "152b"
  WEDO2_SENSOR_VALUE = '00001560-1212-efde-1523-785feabcd123', // "1560"
  WEDO2_VALUE_FORMAT = '00001561-1212-efde-1523-785feabcd123', // "1561"
  WEDO2_PORT_TYPE_WRITE = '00001563-1212-efde-1523-785feabcd123', // "1563"
  WEDO2_MOTOR_VALUE_WRITE = '00001565-1212-efde-1523-785feabcd123', // "1565"
  WEDO2_NAME_ID = '00001524-1212-efde-1523-785feabcd123', // "1524"
  LPF2_ALL = '00001624-1212-efde-1623-785feabcd123'
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#message-types
export enum MessageType {
  HUB_PROPERTIES = 0x01,
  HUB_ACTIONS = 0x02,
  HUB_ALERTS = 0x03,
  HUB_ATTACHED_IO = 0x04,
  GENERIC_ERROR_MESSAGES = 0x05,
  HW_NETWORK_COMMANDS = 0x08,
  FW_UPDATE_GO_INTO_BOOT_MODE = 0x10,
  FW_UPDATE_LOCK_MEMORY = 0x11,
  FW_UPDATE_LOCK_STATUS_REQUEST = 0x12,
  FW_LOCK_STATUS = 0x13,
  PORT_INFORMATION_REQUEST = 0x21,
  PORT_MODE_INFORMATION_REQUEST = 0x22,
  PORT_INPUT_FORMAT_SETUP_SINGLE = 0x41,
  PORT_INPUT_FORMAT_SETUP_COMBINEDMODE = 0x42,
  PORT_INFORMATION = 0x43,
  PORT_MODE_INFORMATION = 0x44,
  PORT_VALUE_SINGLE = 0x45,
  PORT_VALUE_COMBINEDMODE = 0x46,
  PORT_INPUT_FORMAT_SINGLE = 0x47,
  PORT_INPUT_FORMAT_COMBINEDMODE = 0x48,
  VIRTUAL_PORT_SETUP = 0x61,
  PORT_OUTPUT_COMMAND = 0x81,
  PORT_OUTPUT_COMMAND_FEEDBACK = 0x82
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-reference
export enum HubPropertyReference {
  ADVERTISING_NAME = 0x01,
  BUTTON = 0x02,
  FW_VERSION = 0x03,
  HW_VERSION = 0x04,
  RSSI = 0x05,
  BATTERY_VOLTAGE = 0x06,
  BATTERY_TYPE = 0x07,
  MANUFACTURER_NAME = 0x08,
  RADIO_FIRMWARE_VERSION = 0x09,
  LEGO_WIRELESS_PROTOCOL_VERSION = 0x0a,
  SYSTEM_TYPE_ID = 0x0b,
  HW_NETWORK_ID = 0x0c,
  PRIMARY_MAC_ADDRESS = 0x0d,
  SECONDARY_MAC_ADDRESS = 0x0e,
  HARDWARE_NETWORK_FAMILY = 0x0f
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-reference
export enum HubPropertyOperation {
  SET_DOWNSTREAM = 0x01,
  ENABLE_UPDATES_DOWNSTREAM = 0x02,
  DISABLE_UPDATES_DOWNSTREAM = 0x03,
  RESET_DOWNSTREAM = 0x04,
  REQUEST_UPDATE_DOWNSTREAM = 0x05,
  UPDATE_UPSTREAM = 0x06
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#hub-property-reference
export enum HubPropertyPayload {
  ADVERTISING_NAME = 0x01,
  BUTTON_STATE = 0x02,
  FW_VERSION = 0x03,
  HW_VERSION = 0x04,
  RSSI = 0x05,
  BATTERY_VOLTAGE = 0x06,
  BATTERY_TYPE = 0x07,
  MANUFACTURER_NAME = 0x08,
  RADIO_FIRMWARE_VERSION = 0x09,
  LWP_PROTOCOL_VERSION = 0x0a,
  SYSTEM_TYPE_ID = 0x0b,
  HW_NETWORK_ID = 0x0c,
  PRIMARY_MAC_ADDRESS = 0x0d,
  SECONDARY_MAC_ADDRESS = 0x0e,
  HW_NETWORK_FAMILY = 0x0f
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#action-types
export enum ActionType {
  SWITCH_OFF_HUB = 0x01,
  DISCONNECT = 0x02,
  VCC_PORT_CONTROL_ON = 0x03,
  VCC_PORT_CONTROL_OFF = 0x04,
  ACTIVATE_BUSY_INDICATION = 0x05,
  RESET_BUSY_INDICATION = 0x06,
  SHUTDOWN = 0x2f,
  HUB_WILL_SWITCH_OFF = 0x30,
  HUB_WILL_DISCONNECT = 0x31,
  HUB_WILL_GO_INTO_BOOT_MODE = 0x32
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#alert-typeexport enum AlertType {
export enum AlertType {
  LOW_VOLTAGE = 0x01,
  HIGH_CURRENT = 0x02,
  LOW_SIGNAL_STRENGTH = 0x03,
  OVER_POWER_CONDITION = 0x04
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#alert-operation
export enum AlertOperation {
  LOW_VOLTAGE = 0x01,
  HIGH_CURRENT = 0x02,
  LOW_SIGNAL_STRENGTH = 0x03,
  OVER_POWER_CONDITION = 0x04
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#alert-payload
export enum AlertPayload {
  STATUS_OK = 0x00,
  ALERT = 0xff
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#event
export enum Event {
  DETACHED_IO = 0x00,
  ATTACHED_IO = 0x01,
  ATTACHED_VIRTUAL_IO = 0x02
}

// Description https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#io-type-id
export enum IOTypeID {
  MOTOR = 0x0001,
  SYSTEM_TRAIN_MOTOR = 0x0002,
  BUTTON = 0x0005,
  LED_LIGHT = 0x0008,
  VOLTAGE = 0x0014,
  CURRENT = 0x0015,
  PIEZO_TONE_SOUND = 0x0016,
  RGB_LIGHT = 0x0017,
  EXTERNAL_TILT_SENSOR = 0x0022,
  MOTION_SENSOR = 0x0023,
  VISION_SENSOR = 0x0025,
  EXTERNAL_MOTOR = 0x0026,
  INTERNAL_MOTOR = 0x0027,
  INTERNAL_TILT = 0x0028
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#error-codes
export enum ErrorCode {
  ACK = 0x01,
  MACK = 0x02,
  BUFFER_OVERFLOW = 0x03,
  TIMEOUT = 0x04,
  COMMAND_NOT_RECOGNIZED = 0x05,
  INVALID_USE = 0x06,
  OVERCURRENT = 0x07,
  INTERNAL_ERROR = 0x08
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#h-w-network-command-type
export enum HWNetWorkCommandType {
  CONNECTION_REQUEST = 0x02,
  FAMILY_REQUEST = 0x03,
  FAMILY_SET = 0x04,
  JOIN_DENIED = 0x05,
  GET_FAMILY = 0x06,
  FAMILY = 0x07,
  GET_SUBFAMILY = 0x08,
  SUBFAMILY = 0x09,
  SUBFAMILY_SET = 0x0a,
  GET_EXTENDED_FAMILY = 0x0b,
  EXTENDED_FAMILY = 0x0c,
  EXTENDED_FAMILY_SET = 0x0d,
  RESET_LONG_PRESS_TIMING = 0x0e
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#h-w-network-family
export enum HWNetworkFamily {
  GREEN = 0x01,
  YELLOW = 0x02,
  RED = 0x03,
  BLUE = 0x04,
  PURPLE = 0x05,
  LIGHT_BLUE = 0x06,
  TEAL = 0x07,
  PINK = 0x08,
  WHITE = 0x00
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#h-w-network-sub-family
export enum HWNetworkSubFamily {
  ONE_FLASH = 0x01,
  TWO_FLASHES = 0x02,
  THREE_FLASHES = 0x03,
  FOUR_FLASHES = 0x04,
  FIVE_FLASHES = 0x05,
  SIX_FLASHES = 0x06,
  SEVEN_FLASHES = 0x07
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#mode-information-types
export enum ModeInformationType {
  NAME = 0x00,
  RAW = 0x01,
  PCT = 0x02,
  SI = 0x03,
  SYMBOL = 0x04,
  MAPPING = 0x05,
  USED_INTERNALLY = 0x06,
  MOTOR_BIAS = 0x07,
  CAPABILITY_BITS = 0x08,
  VALUE_FORMAT = 0x80
}

// Description: https://lego.github.io/lego-ble-wireless-protocol-docs/index.html#port-input-format-setup-sub-commands
export enum PortInputFormatSetupSubCommand {
  SET_MODEANDDATASET_COMBINATIONS = 0x01,
  LOCK_LPF2_DEVICE_FOR_SETUP = 0x02,
  UNLOCKANDSTARTWITHMULTIUPDATEENABLED = 0x03,
  UNLOCKANDSTARTWITHMULTIUPDATEDISABLED = 0x04,
  NOT_USED = 0x05,
  RESET_SENSOR = 0x06
}

export enum MarioPantsType {
  NONE = 0x00,
  PROPELLER = 0x06,
  CAT = 0x11,
  FIRE = 0x12,
  NORMAL = 0x21,
  BUILDER = 0x22
}

export enum MarioColor {
  WHITE = 0x1300,
  RED = 0x1500,
  BLUE = 0x1700,
  YELLOW = 0x1800,
  BLACK = 0x1a00,
  GREEN = 0x2500,
  BROWN = 0x6a00,
  CYAN = 0x4201
}
