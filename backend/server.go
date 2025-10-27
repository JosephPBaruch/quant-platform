package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/JosephPBaruch/backtesting"
	"github.com/google/uuid"
)

type Server struct {
	service *Service
	mux   *http.ServeMux
}

// TODO: Create server interface

func NewServer() *Server {
	s := &Server{service: NewService(), mux: http.NewServeMux()}

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

	strategies, err := s.service.GetStrategies()

	if err != nil {
		writeJSON(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, strategies)
}

func (s *Server) handleGetBacktest(w http.ResponseWriter, r *http.Request) {

	strats := s.service.GetBacktest()
	writeJSON(w, http.StatusOK, strats)
}

func (s *Server) handlePostBacktest(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()
	var strat StratName
	if err := json.NewDecoder(r.Body).Decode(&strat); err != nil {
		writeJSON(w, http.StatusBadRequest, err)
		return
	}

	s.service.PostBacktest(strat)

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

	config, err := s.service.GetBacktestInfo(id)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, err)
		return
	}

	writeJSON(w, http.StatusOK, config)
}

func (s *Server) handlePostBacktestInfo(w http.ResponseWriter, r *http.Request) {
	
	path := r.URL.Path
	idStr := strings.TrimPrefix(path, "/backtest/")

	// Optionally handle trailing slash cases:
	idStr = strings.TrimSuffix(idStr, "/")

	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "invalid UUID", http.StatusBadRequest)
		return
	}

	defer r.Body.Close()
	var params backtesting.Backtest
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		writeJSON(w, http.StatusBadRequest, err)
		return
	}

	err = s.service.PostBacktestInfo(id, params)
	if err != nil {
		fmt.Print(err)
		writeJSON(w, http.StatusInternalServerError, fmt.Errorf("Error occurred: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, nil)
}
