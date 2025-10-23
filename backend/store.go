package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/JosephPBaruch/react-go-sandbox/backend/backtesting"
)

type Store struct {
	mu    sync.RWMutex
	items map[int64]*backtesting.Backtest
}

func NewStore() *Store {
	return &Store{items: make(map[int64]*backtesting.Backtest)}
}

var (
	ErrNotFound   = errors.New("not found")
	ErrBadRequest = errors.New("bad request")
)

func (s *Store) GetBacktest() (backtesting.Result, error) {

	data, err := os.ReadFile("backend/result.json")
	if err != nil {
		return backtesting.Result{}, err
	}

	result := backtesting.Result{}

	err = json.Unmarshal(data, &result)
	if err != nil {
		return backtesting.Result{}, err
	}

	return result, nil
}

func (s *Store) PostBacktest(back backtesting.Backtest) error {
	// Run the backtest
	profit, err := backtesting.Execute(back)
	if err != nil {
		return err
	}

	// Create the result object
	result := backtesting.Result{
		Configuration: back,
		EndingCash:    back.StartingCash + profit,
	}

	// Marshal result to JSON
	data, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal result: %w", err)
	}

	// Ensure directory exists
	outputPath := filepath.Join("backend", "result.json")
	if err := os.MkdirAll(filepath.Dir(outputPath), 0755); err != nil {
		return fmt.Errorf("failed to create output directory: %w", err)
	}

	// Write JSON to file
	if err := os.WriteFile(outputPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write result file: %w", err)
	}

	return nil
}
