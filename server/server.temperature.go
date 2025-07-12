package server

import (
	"encoding/json"
	"net/http"
)

func PatchTemperature(w http.ResponseWriter, r *http.Request) {
	var payload struct{ Temperature uint16 }
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = Lamp.SetTemperature(payload.Temperature)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
