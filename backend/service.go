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
	// Run the backtest
	profit, err := s.backtest.Execute(params)
	if err != nil {
		return err
	}

	s.mu.Lock()
	for i := range s.stratsStore {
		if s.stratsStore[i].Id == Id {
			s.stratsStore[i].Params = params
			s.stratsStore[i].EndingCash = profit
			break
		}
	}
	s.mu.Unlock()

	return nil
}
