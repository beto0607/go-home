package lamp

import "tinygo.org/x/bluetooth"

// Reference: https://github.com/flip-dots/HueBLE/blob/main/HueBLE.py
// #: String containing manufacturer. Handle 15.
const UUID_MANUFACTURER = "00002a29-0000-1000-8000-00805f9b34fb"

// #: String containing model number. Handle 17
const UUID_MODEL = "00002a24-0000-1000-8000-00805f9b34fb"

// #: String containing firmware version. Handle 19.
const UUID_FW_VERSION = "00002a28-0000-1000-8000-00805f9b34fb"

// #: String containing Zigbee address. Handle 22.
const UUID_ZIGBEE_ADDRESS = "97fe6561-0001-4f62-86e9-b71ee2da3d22"

// #: String containing light name. Handle 24
const UUID_NAME = "97fe6561-0003-4f62-86e9-b71ee2da3d22"

// #: Power state of light. Is subscribable. x00 and x01. Handle 49.
const UUID_POWER = "932c32bd-0002-47a2-835a-a8d455b859dd"
const UUID_STATE_SERVICE = "932c32bd-0000-47a2-835a-a8d455b859dd"

// #: This is a UUID that as far as I know only hue lights use and it shows up
// #: under BLE Device details and as such does not require connecting to check
// #: for. The UUID also has the following service data. I am not sure what it
// #: means but it is the same for both of my colour lights with model no LCA006.
// #: \x02\x10\x0e\xbe\x02
const UUID_HUE_IDENTIFIER = "0000fe0f-0000-1000-8000-00805f9b34fb"

// #: Temperature of light. Int 153-500. 0xFFFF when colour enabled. Handle 55.
const UUID_TEMPERATURE = "932c32bd-0004-47a2-835a-a8d455b859dd"

// #: Brightness of light. Int 0-255. Handle 52.
const UUID_BRIGHTNESS = "932c32bd-0003-47a2-835a-a8d455b859dd"

// #: XY colour of light. Two 16-bit ints. 0xFFFFFFFF when CW/WW. Handle 58.
const UUID_XY_COLOR = "932c32bd-0005-47a2-835a-a8d455b859dd"

type UUIDConstants struct {
	UUIDHueId               bluetooth.UUID
	UUIDNameCharacteristic  bluetooth.UUID
	UUIDPowerCharacteristic bluetooth.UUID
	UUIDStateService        bluetooth.UUID
	UUIDTemperature         bluetooth.UUID
	UUIDBrightness          bluetooth.UUID
	UUIDXYColor             bluetooth.UUID
}

func LoadConstants() UUIDConstants {
	uuidStateService, _ := bluetooth.ParseUUID(UUID_STATE_SERVICE)

	uuidPowerCharacteristic, _ := bluetooth.ParseUUID(UUID_POWER)

	uuidNameCharacteristic, _ := bluetooth.ParseUUID(UUID_NAME)

	uuidHueId, _ := bluetooth.ParseUUID(UUID_HUE_IDENTIFIER)

	uuidBrightness, _ := bluetooth.ParseUUID(UUID_BRIGHTNESS)
	uuidTemperature, _ := bluetooth.ParseUUID(UUID_TEMPERATURE)
	uuidXYColor, _ := bluetooth.ParseUUID(UUID_XY_COLOR)

	return UUIDConstants{
		UUIDBrightness:          uuidBrightness,
		UUIDHueId:               uuidHueId,
		UUIDNameCharacteristic:  uuidNameCharacteristic,
		UUIDPowerCharacteristic: uuidPowerCharacteristic,
		UUIDStateService:        uuidStateService,
		UUIDTemperature:         uuidTemperature,
		UUIDXYColor:             uuidXYColor,
	}
}
