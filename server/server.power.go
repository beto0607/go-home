package server

import (
	"encoding/json"
	"net/http"
)

func PatchPower(w http.ResponseWriter, r *http.Request) {
	var payload struct{ Power bool }
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = Lamp.SetPower(payload.Power)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
