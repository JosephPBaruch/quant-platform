package backtesting

import "github.com/JosephPBaruch/backtesting/strategies"

// StrategyFunc is a pluggable strategy function that is called for each bar index.
// It receives the index (0-based) and the full bars slice so strategies can lookback.
type StrategyFunc func(i int, bars []strategies.Bar) strategies.Signal

// Trade is a simple record of executed trades.
type Trade struct {
	Index int
	Type  strategies.Signal
	Price float64
}

type Backtest struct {
	Ticker       string  `json:"ticker"`
	Start        string  `json:"start"`
	End          string  `json:"end"`
	Increment    string  `json:"increment"`
	StartingCash float64 `json:"startingCash"`
}

type Strategy struct {
	Name string `json:"name"` 
}
