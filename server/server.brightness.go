package server

import (
	"encoding/json"
	"net/http"
)

func PatchBrightness(w http.ResponseWriter, r *http.Request) {
	var payload struct{ Brightness uint8 }
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = Lamp.SetBrightness(payload.Brightness)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)

}
