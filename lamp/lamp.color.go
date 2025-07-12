package lamp

import (
	"bytes"
	"encoding/binary"
	"errors"

	"tinygo.org/x/bluetooth"
)

const MAX_UINT16 float64 = 65535.0

func (self *Lamp) GetXYColor() (color *XYColor, err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return nil, errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDXYColor})
	if len(characteristics) == 0 {
		return nil, errors.New("XYColor characteristic not found")
	}

	data := make([]byte, 4)
	n, err := characteristics[0].Read(data)
	if n != 4 {
		return nil, errors.New("Wrong value from device")
	}

	xu16 := binary.LittleEndian.Uint16(data[0:2])
	yu16 := binary.LittleEndian.Uint16(data[2:4])

	xValue := float64(xu16) / 0xFFFF
	yValue := float64(yu16) / 0xFFFF

	self.Color = XYColor{
		X: xValue,
		Y: yValue,
	}
	return &self.Color, nil
}
func (self *Lamp) SetXYColor(x float64, y float64) (err error) {
	services, err := self.device.DiscoverServices([]bluetooth.UUID{self.constants.UUIDStateService})
	if len(services) == 0 {
		return errors.New("Hue ID service not found")
	}

	characteristics, err := services[0].DiscoverCharacteristics([]bluetooth.UUID{self.constants.UUIDXYColor})
	if len(characteristics) == 0 {
		return errors.New("XYColor characteristic not found")
	}

	uint16_x := uint16(x * MAX_UINT16)
	uint16_y := uint16(y * MAX_UINT16)

	buf := new(bytes.Buffer)
	err = binary.Write(buf, binary.LittleEndian, uint16_x)
	if err != nil {
		return err
	}
	err = binary.Write(buf, binary.LittleEndian, uint16_y)
	if err != nil {
		return err
	}
	characteristics[0].WriteWithoutResponse(buf.Bytes()[0:4])

	self.Color.X = x
	self.Color.Y = y
	return nil
}
