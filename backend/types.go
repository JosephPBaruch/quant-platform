package main

import (
	"github.com/JosephPBaruch/backtesting"
	"github.com/google/uuid"
)

type Strats struct {
	Id     uuid.UUID
	Name   string
	Params backtesting.Backtest
	DayState []backtesting.DayState
	EndingCash float64
}

type StratName struct {
	Name string
}
