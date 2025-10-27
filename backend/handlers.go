package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/uuid"
)

type Server struct {
	store *Store
	mux   *http.ServeMux
}

func NewServer() *Server {
	s := &Server{store: NewStore(), mux: http.NewServeMux()}

	// Go 1.22 patterns: "METHOD /path" and "/path/{var}"
	s.mux.HandleFunc("GET /strategies", s.handleGetStrategies)

	s.mux.HandleFunc("GET /backtest", s.handleGetBacktest)
	s.mux.HandleFunc("POST /backtest", s.handlePostBacktest)

	s.mux.HandleFunc("GET /backtest/", s.handleGetBacktestInfo)
	s.mux.HandleFunc("POST /backtest/{id}", s.handlePostBacktestInfo)

	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.mux.ServeHTTP(w, r)
}

func (s *Server) handleGetStrategies(w http.ResponseWriter, r *http.Request) {

	strategies, err := s.store.GetStrategies()

	if err != nil {
		writeJSON(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, strategies)
}

func (s *Server) handleGetBacktest(w http.ResponseWriter, r *http.Request) {

	strats := s.store.GetBacktest()
	writeJSON(w, http.StatusOK, strats)
}

func (s *Server) handlePostBacktest(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()
	var strat StratName
	if err := json.NewDecoder(r.Body).Decode(&strat); err != nil {
		writeJSON(w, http.StatusBadRequest, err)
		return
	}

	s.store.PostBacktest(strat)

	writeJSON(w, http.StatusOK, nil)
}

func (s *Server) handleGetBacktestInfo(w http.ResponseWriter, r *http.Request) {

	path := r.URL.Path
	idStr := strings.TrimPrefix(path, "/backtest/")

	// Optionally handle trailing slash cases:
	idStr = strings.TrimSuffix(idStr, "/")

	id, err := uuid.Parse(idStr)
	if err != nil {
		// fmt.Print(id)
		http.Error(w, "invalid UUID", http.StatusBadRequest)
		return
	}

	config, err := s.store.GetBacktestInfo(id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, config)
}

func (s *Server) handlePostBacktestInfo(w http.ResponseWriter, r *http.Request) {
	// TODO:  get id parameter

	defer r.Body.Close()
	var backtest Strats
	if err := json.NewDecoder(r.Body).Decode(&backtest); err != nil {
		writeJSON(w, http.StatusBadRequest, err)
		return
	}

	err := s.store.PostBacktestInfo(backtest)
	if err != nil {
		fmt.Print(err)
		writeJSON(w, http.StatusInternalServerError, fmt.Errorf("Error occurred: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, nil)
}
