package test

import (
	"go-home/lamp"
	"log"
	"time"
)

func Test(l *lamp.Lamp) {
	_, err := l.GetName()
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

	TestPower(l)
	TestTemperature(l)
	TestBrightness(l)
	TestColor(l)

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

func TestPower(l *lamp.Lamp) {
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

func TestTemperature(l *lamp.Lamp) {
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

func TestColor(l *lamp.Lamp) {
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

func TestBrightness(l *lamp.Lamp) {
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
