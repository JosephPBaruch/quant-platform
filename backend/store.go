package main

import (
	"errors"
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
	EndingCash float64
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

func (s *Store) GetBacktestInfo(id uuid.UUID) (Strats, error) {

	returnStrat := Strats{}

	for _, s := range s.strats {
		if s.Id == id {
			returnStrat = s
			break
		}
	}

	return returnStrat, nil
}

func (s *Store) PostBacktestInfo(Id uuid.UUID, params backtesting.Backtest) error {
	// Run the backtest
	profit, err := backtesting.Execute(params)
	if err != nil {
		return err
	}

	s.mu.Lock()
	for i := range s.strats {
		if s.strats[i].Id == Id {
			s.strats[i].Params = params
			s.strats[i].EndingCash = profit
			break
		}
	}
	s.mu.Unlock()

	return nil
}
