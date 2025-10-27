package main

import (
	"errors"
	"sync"

	"github.com/JosephPBaruch/backtesting"
	"github.com/google/uuid"
)

type Service struct {
	mu     sync.RWMutex
	stratsStore []Strats
	backtest backtesting.BACKTEST
}

func NewService() *Service {
	return &Service{stratsStore: []Strats{}, backtest: backtesting.NewBacktesting()}
}

// TODO: Create service interface

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

func (s *Service) GetStrategies() ([]backtesting.Strategy, error) {

	return s.backtest.GetStrategies()
}

func (s *Service) GetBacktest() []Strats {
	return s.stratsStore
}

func (s *Service) PostBacktest(strat StratName) {
	s.stratsStore = append(s.stratsStore, Strats{Id: uuid.New(), Name: strat.Name, Params: backtesting.Backtest{}})
}

func (s *Service) GetBacktestInfo(id uuid.UUID) (Strats, error) {

	returnStrat := Strats{}

	for _, s := range s.stratsStore {
		if s.Id == id {
			returnStrat = s
			break
		}
	}

	return returnStrat, nil
}

func (s *Service) PostBacktestInfo(Id uuid.UUID, params backtesting.Backtest) error {
	// Find the target index once; no second loop.
	s.mu.Lock()
	idx := -1
	var strat string
	for i := range s.stratsStore {
		if s.stratsStore[i].Id == Id {
			idx = i
			strat = s.stratsStore[i].Name
			break
		}
	}
	s.mu.Unlock()

	if idx == -1 {
		return ErrNotFound
	}

	// Run the backtest with the selected strategy name
	profit, err := s.backtest.Execute(strat, params)
	if err != nil {
		return err
	}

	s.mu.Lock()
	s.stratsStore[idx].Params = params
	s.stratsStore[idx].EndingCash = profit
	s.mu.Unlock()

	return nil
}
