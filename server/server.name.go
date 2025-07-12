package server

import (
	"encoding/json"
	"net/http"
)

func PatchName(w http.ResponseWriter, r *http.Request) {
	var payload struct{ Name string }
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = Lamp.SetName(payload.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
