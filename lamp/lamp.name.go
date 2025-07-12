package lamp

import (
	"errors"
	"log"

	"tinygo.org/x/bluetooth"
)

func (self *Lamp) GetName() (name string, err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDHueId})
	if len(services) == 0 {
		return "", errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDNameCharacteristic})
	if len(characteristics) == 0 {
		return "", errors.New("Name characteristic not found")
	}

	data := make([]byte, 128)
	n, err := characteristics[0].Read(data)

	if err != nil {
		return "", err
	}

	self.Name = string(data[0:n])
	return self.Name, nil
}

func (self *Lamp) SetName(name string) (err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDHueId})
	if len(services) == 0 {
		return errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDNameCharacteristic})
	if len(characteristics) == 0 {
		return errors.New("Name characteristic not found")
	}

	n, err := characteristics[0].WriteWithoutResponse([]byte(name))
	if err != nil {
		return err
	}
	if n != len(name) {
		log.Printf("Wrote %d of %d\n", n, len(name))
		return errors.New("Did not set the name completely.")
	}

	self.Name = name
	return nil
}
