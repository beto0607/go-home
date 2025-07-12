package main

import (
	"go-home/lamp"
	"go-home/server"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"tinygo.org/x/bluetooth"
)

func main() {
	_ = godotenv.Load()

	macAddress, ok := os.LookupEnv("LAMP_MAC_ADDRESS")
	if !ok {
		panic("No mac address for lamp")
	}

	adapter := bluetooth.DefaultAdapter
	// Enable adapter
	err := adapter.Enable()
	if err != nil {
		panic("failed to enable BLE adapter")
	}

	l, err := lamp.NewLamp(macAddress)
	if err != nil {
		panic(err.Error())
	}
	err = l.Connect(adapter)
	if err != nil {
		panic(err.Error())
	}
	log.Println("Lamp connected, maybe?")

	server.Lamp = l
	http.HandleFunc("GET /state", server.GetLampState)
	http.HandleFunc("PATCH /power", server.PatchPower)
	http.HandleFunc("PATCH /brightness", server.PatchBrightness)
	http.HandleFunc("PATCH /temperature", server.PatchTemperature)
	http.HandleFunc("PATCH /color", server.PatchColor)
	http.HandleFunc("PATCH /name", server.PatchName)

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8080"
	}

	log.Printf("Listening in %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
