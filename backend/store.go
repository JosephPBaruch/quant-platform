package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/JosephPBaruch/react-go-sandbox/backend/backtesting"
	"github.com/google/uuid"
)

type Store struct {
	mu     sync.RWMutex
	strats []Strats
}

func NewStore() *Store {
	return &Store{strats: []Strats{}}
}

var (
	ErrNotFound   = errors.New("not found")
	ErrBadRequest = errors.New("bad request")
)

type Strats struct {
	Id     uuid.UUID
	Name   string
	Params backtesting.Backtest
}

type Result struct {
	Strat   Strats
	EndCash float64
}

type StratName struct {
	Name string
}

func (s *Store) GetStrategies() ([]backtesting.Strategy, error) {

	return backtesting.GetStrategies()
}

func (s *Store) GetBacktest() []Strats {
	return s.strats
}

func (s *Store) PostBacktest(strat StratName) {
	s.strats = append(s.strats, Strats{Id: uuid.New(), Name: strat.Name, Params: backtesting.Backtest{}})
}

func (s *Store) GetBacktestInfo(id uuid.UUID) (Result, error) {
	filePath := "backend/" + id.String() + ".json"

	file, err := os.Stat(filePath)
	if file == nil || err != nil {
		return Result{}, err
	}

	data, err := os.ReadFile(filePath)
	if err != nil {
		return Result{}, err
	}

	result := backtesting.Result{}

	err = json.Unmarshal(data, &result)
	if err != nil {
		return Result{}, err
	}

	returnStrat := Strats{}

	fmt.Printf("\n\nTarget ID: %s", id.String())
	fmt.Printf("\n\nLength: %d\n", len(s.strats))

	for _, s := range s.strats {
		fmt.Printf("\nOther ID: %s", s.Id.String())

		if s.Id == id {
			returnStrat = s
			break
		}
	}

	return Result{
		Strat:   returnStrat,
		EndCash: result.EndingCash,
	}, nil
}

func (s *Store) PostBacktestInfo(back Strats) error {
	// Run the backtest
	profit, err := backtesting.Execute(back.Params)
	if err != nil {
		return err
	}

	s.mu.Lock()
	for i := range s.strats {
		fmt.Printf("\nOther ID: %s\n", s.strats[i].Id.String())
		if s.strats[i].Id == back.Id {
			s.strats[i] = back
			break
		}
	}
	s.mu.Unlock()

	// Create the result object
	result := backtesting.Result{
		Configuration: back.Params,
		EndingCash:    back.Params.StartingCash + profit,
	}

	// Marshal result to JSON
	data, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal result: %w", err)
	}

	// Ensure directory exists
	outputPath := filepath.Join("backend", back.Id.String()+".json")
	if err := os.MkdirAll(filepath.Dir(outputPath), 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	// Write JSON to file
	if err := os.WriteFile(outputPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write result file: %w", err)
	}

	return nil
}
