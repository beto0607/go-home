package main

import (
	"go-home/lamp"
	"go-home/server"
	"log"
	"net/http"

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

	server.Lamp = l
	http.HandleFunc("GET /state", server.GetLampState)
	http.HandleFunc("PATCH /power", server.PatchPower)
	http.HandleFunc("PATCH /brightness", server.PatchBrightness)
	http.HandleFunc("PATCH /temperature", server.PatchTemperature)
	http.HandleFunc("PATCH /color", server.PatchColor)
	http.HandleFunc("PATCH /name", server.PatchName)

	port := ":8080"
	log.Printf("Listening in %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))

}
