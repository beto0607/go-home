package lamp

import (
	"errors"

	"tinygo.org/x/bluetooth"
)

func (self *Lamp) GetPower() (power bool, err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return false, errors.New("Power service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDPowerCharacteristic})
	if len(characteristics) == 0 {
		return false, errors.New("Power characteristic not found")
	}

	data := make([]byte, 1)
	n, err := characteristics[0].Read(data)
	if n != 1 {
		return false, errors.New("Power - Wrong value from device")
	}
	power = data[0] != 0
	self.Powered = power
	return power, nil
}

func (self *Lamp) SetPower(power bool) (err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return errors.New("Power service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDPowerCharacteristic})
	if len(characteristics) == 0 {
		return errors.New("Power characteristic not found")
	}

	if power {
		characteristics[0].WriteWithoutResponse([]byte{1})
	} else {
		characteristics[0].WriteWithoutResponse([]byte{0})
	}
	self.Powered = power
	return nil
}
