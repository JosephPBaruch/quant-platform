package main

import (
	"log"
	"net/http"
)

// --- main ---

func main() {
	srv := NewServer()

	// Compose middlewares
	handler := withCORS(withLogging(srv))

	addr := ":8080"
	log.Printf("listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}
