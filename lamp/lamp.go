package lamp

import (
	"tinygo.org/x/bluetooth"
)

type XYColor struct {
	X float64
	Y float64
}

type Lamp struct {
	macAddress string

	address bluetooth.Address
	mac     bluetooth.MAC
	device  bluetooth.Device

	Powered     bool
	Color       XYColor
	Name        string
	Temperature uint16 // 153-500
	Brightness  uint8  // 0-255

	constants UUIDConstants
}

func NewLamp(macAddress string) (*Lamp, error) {
	uuidConstants := LoadConstants()
	return &Lamp{
		Name:       "<unnamed>",
		macAddress: macAddress,
		Powered:    false,
		Color: XYColor{
			X: 0,
			Y: 0,
		},
		constants:   uuidConstants,
		Temperature: 0,
		Brightness:  0,
	}, nil
}

func (self *Lamp) Connect(adapter *bluetooth.Adapter) (err error) {
	err = adapter.Enable()
	if err != nil {
		return err
	}
	self.mac, err = bluetooth.ParseMAC(self.macAddress)
	if err != nil {
		return err
	}
	self.address = bluetooth.Address{MACAddress: bluetooth.MACAddress{MAC: self.mac}}

	device, err := adapter.Connect(self.address, bluetooth.ConnectionParams{})
	if err != nil {
		return err
	}
	self.device = device

	return nil
}
