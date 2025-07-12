package server

import (
	"encoding/json"
	"net/http"
)

func PatchColor(w http.ResponseWriter, r *http.Request) {
	var payload LampColor
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = Lamp.SetXYColor(payload.X, payload.Y)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
