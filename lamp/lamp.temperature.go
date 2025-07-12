package lamp

import (
	"bytes"
	"encoding/binary"
	"errors"
	"strconv"

	"tinygo.org/x/bluetooth"
)

func (self *Lamp) GetTemperature() (temperature uint16, err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return 0, errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDTemperature})
	if len(characteristics) == 0 {
		return 0, errors.New("Temperature characteristic not found")
	}

	data := make([]byte, 2)
	n, err := characteristics[0].Read(data)
	if n != 2 {
		return 0, errors.New("Wrong value from device")
	}

	temperature = binary.LittleEndian.Uint16(data)

	self.Temperature = temperature
	return self.Temperature, nil
}

func (self *Lamp) SetTemperature(temperature uint16) (err error) {
	if temperature > 500 || temperature < 153 {
		return errors.New("Invalid value. Expected 153 - 500 range. Got: " + strconv.FormatUint(uint64(temperature), 10))
	}
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDTemperature})
	if len(characteristics) == 0 {
		return errors.New("Temperature characteristic not found")
	}

	buf := new(bytes.Buffer)
	err = binary.Write(buf, binary.LittleEndian, temperature)
	if err != nil {
		return err
	}
	characteristics[0].WriteWithoutResponse(buf.Bytes())

	self.Temperature = temperature
	return nil
}
