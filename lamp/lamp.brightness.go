package lamp

import (
	"errors"

	"tinygo.org/x/bluetooth"
)

func (self *Lamp) GetBrightness() (brightness uint8, err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return 0, errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDBrightness})
	if len(characteristics) == 0 {
		return 0, errors.New("Brightness characteristic not found")
	}

	data := make([]byte, 1)
	n, err := characteristics[0].Read(data)
	if n != 1 {
		return 0, errors.New("Brightness - Wrong value from device")
	}

	brightness = uint8(data[0])

	self.Brightness = brightness
	return brightness, nil
}

func (self *Lamp) SetBrightness(brightness uint8) (err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDBrightness})
	if len(characteristics) == 0 {
		return errors.New("Brightness characteristic not found")
	}

	characteristics[0].WriteWithoutResponse([]byte{brightness})
	self.Brightness = brightness

	return nil
}
