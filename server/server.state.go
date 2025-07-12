package server

import (
	"encoding/json"
	"go-home/lamp"
	"net/http"
)

type LampColor struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
type LampState struct {
	Powered     bool      `json:"powered"`
	Name        string    `json:"string"`
	Brightness  int       `json:"brightness"`
	Temperature int       `json:"temperature"`
	Color       LampColor `json:"color"`
}

var Lamp *lamp.Lamp

func GetLampState(w http.ResponseWriter, r *http.Request) {
	powered, err := Lamp.GetPower()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	name, err := Lamp.GetName()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	brightness, err := Lamp.GetBrightness()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	temperature, err := Lamp.GetTemperature()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	color, err := Lamp.GetXYColor()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	state := LampState{
		Powered:     powered,
		Name:        name,
		Brightness:  int(brightness),
		Temperature: int(temperature),
		Color: LampColor{
			X: color.X,
			Y: color.Y,
		},
	}

	encoder := json.NewEncoder(w)
	encoder.Encode(state)
}
