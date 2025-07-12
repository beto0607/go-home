package main

import (
	"go-home/lamp"
	"log"
	"time"

	"tinygo.org/x/bluetooth"
)

const LAMP_BLUETOOTH_ADDRESS = "D6:5A:AD:D3:6C:87"

func main() {
	adapter := bluetooth.DefaultAdapter
	// Enable adapter
	err := adapter.Enable()
	if err != nil {
		panic("failed to enable BLE adapter")
	}

	l, err := lamp.NewLamp(LAMP_BLUETOOTH_ADDRESS)
	if err != nil {
		panic(err.Error())
	}
	err = l.Connect(adapter)
	if err != nil {
		panic(err.Error())
	}
	println("Lamp connected, maybe?")
	_, err = l.GetName()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Name: %s\n", l.Name)

	println("Turn on lamp")
	// err = l.SetPower(true)
	// if err != nil {
	// 	panic(err.Error())
	// }
	// time.Sleep(time.Second * 2)

	testPower(l)
	testTemperature(l)
	testBrightness(l)
	testColor(l)

	// uuid := "0000fe0f-0000-1000-8000-00805f9b34fb"
	// err = lamp.LogCharacteristicsFor(uuid)
	// if err != nil {
	// 	panic(err.Error())
	// }

	println("Turn off lamp")
	err = l.SetPower(false)
	if err != nil {
		panic(err.Error())
	}
}

func testPower(l *lamp.Lamp) {
	log.Println("Testing power")

	power, err := l.GetPower()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Power: %t\n", power)
	time.Sleep(time.Second * 3)

	err = l.SetPower(true)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Power: %t\n", l.Powered)

	power, err = l.GetPower()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Power: %t\n", power)
	time.Sleep(time.Second * 3)
}

func testTemperature(l *lamp.Lamp) {
	log.Println("Testing temperature")
	temperature, err := l.GetTemperature()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Temperature: %d\n", temperature)
	time.Sleep(time.Second * 3)

	err = l.SetTemperature(0x00ff)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Temperature set to: %d\n", l.Temperature)
	time.Sleep(time.Second * 3)

	err = l.SetTemperature(153)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Temperature set to: %d\n", l.Temperature)
	time.Sleep(time.Second * 3)

	if temperature > 500 {
		temperature = 200
	}
	err = l.SetTemperature(temperature)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Temperature set to: %d\n", l.Temperature)
	time.Sleep(time.Second * 3)
}

func testColor(l *lamp.Lamp) {
	log.Println("Testing color")

	xyColor, err := l.GetXYColor()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Color: %f %f\n", xyColor.X, xyColor.Y)
	time.Sleep(time.Second * 3)

	err = l.SetXYColor(0.165, 0.191)
	if err != nil {
		panic(err.Error())
	}
	time.Sleep(time.Second * 3)

	err = l.SetXYColor(0.522, 0.379)
	if err != nil {
		panic(err.Error())
	}
	time.Sleep(time.Second * 3)

	err = l.SetXYColor(xyColor.X, xyColor.Y)
	if err != nil {
		panic(err.Error())
	}
	time.Sleep(time.Second * 3)

}

func testBrightness(l *lamp.Lamp) {
	log.Println("Testing brightness")
	brightness, err := l.GetBrightness()
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Brightness: %d\n", brightness)
	time.Sleep(time.Second * 3)

	err = l.SetBrightness(255)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Brightnessset to: %d\n", l.Brightness)
	time.Sleep(time.Second * 3)

	err = l.SetBrightness(5)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Brightnessset to: %d\n", l.Brightness)
	time.Sleep(time.Second * 3)

	err = l.SetBrightness(brightness)
	if err != nil {
		panic(err.Error())
	}
	log.Printf("Brightnessset to: %d\n", l.Brightness)
	time.Sleep(time.Second * 3)
}

// ---------------------------------
// var found = false
//
// func onScan(adapter *bluetooth.Adapter, device bluetooth.ScanResult) {
// 	if device.Address.String() == LAMP_BLUETOOTH_ADDRESS && !found {
// 		found = true
// 		log.Println("Found lamp")
// 		for _, v := range device.ServiceData() {
// 			log.Println(v.UUID)
// 			log.Println(v.UUID.Bytes())
// 		}
// 		go func() {
// 			res, err := adapter.Connect(device.Address, bluetooth.ConnectionParams{})
// 			if err != nil {
// 				println("error connecting:", err.Error())
// 				return
// 			}
// 			// Call connect callback
// 			onConnect(device, res)
// 		}()
// 	}
// }
//
// func onConnect(scanResult bluetooth.ScanResult, device bluetooth.Device) {
// 	println("connected:", scanResult.Address.String(), scanResult.LocalName())
// 	log.Println(device.Address)
// 	uuidPowerService, _ := bluetooth.ParseUUID(UUID_POWER_SERVICE)
// 	services, err := device.DiscoverServices([]bluetooth.UUID{uuidPowerService})
// 	if err != nil {
// 		println("error getting services:", err.Error())
// 		return
// 	}
// 	log.Printf("Service to find: %s", UUID_POWER_SERVICE)
// 	for _, service := range services {
// 		log.Printf("Service: %s", service.UUID().String())
// 		if service.UUID().String() == UUID_POWER_SERVICE {
// 			log.Printf("Service power found")
// 			uuidPowerCharacteristic, _ := bluetooth.ParseUUID(UUID_POWER)
// 			characteristics, err := service.DiscoverCharacteristics([]bluetooth.UUID{uuidPowerCharacteristic})
// 			if err != nil {
// 				println("error getting characteristics:", err.Error())
// 				return
// 			}
// 			for _, characteristic := range characteristics {
// 				log.Printf("Characteristics : %s", characteristic.String())
// 				if characteristic.String() == UUID_POWER {
// 					// characteristic.WriteWithoutResponse([]byte{1})
// 					characteristic.WriteWithoutResponse([]byte{0})
// 				}
// 			}
// 		}
// 	}
//
// }
