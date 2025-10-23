package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/JosephPBaruch/react-go-sandbox/backend/backtesting"
)

type Server struct {
	store *Store
	mux   *http.ServeMux
}

func NewServer() *Server {
	s := &Server{store: NewStore(), mux: http.NewServeMux()}

	// Go 1.22 patterns: "METHOD /path" and "/path/{var}"
	s.mux.HandleFunc("GET /backtest", s.handleGetBacktest)
	s.mux.HandleFunc("POST /backtest", s.handlePostBacktest)

	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.mux.ServeHTTP(w, r)
}

func (s *Server) handleGetBacktest(w http.ResponseWriter, r *http.Request) {

	config, err := s.store.GetBacktest()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, config)
}

func (s *Server) handlePostBacktest(w http.ResponseWriter, r *http.Request) {
	// Decode JSON request body into a Backtest config

	defer r.Body.Close()
	var backtest backtesting.Backtest
	if err := json.NewDecoder(r.Body).Decode(&backtest); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON body"})
		return
	}

	err := s.store.PostBacktest(backtest)
	if err != nil {
		fmt.Print(err)
		writeJSON(w, http.StatusInternalServerError, fmt.Errorf("Error occurred: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, nil)
}
