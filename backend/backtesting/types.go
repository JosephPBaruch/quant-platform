package backtesting

import "github.com/JosephPBaruch/backtesting/strategies"

// // Bar represents a daily OHLCV bar and adjusted values from Tiingo CSV
// type Bar struct {
// 	Date        string
// 	Close       float64
// 	High        float64
// 	Low         float64
// 	Open        float64
// 	Volume      int64
// 	AdjClose    float64
// 	AdjHigh     float64
// 	AdjLow      float64
// 	AdjOpen     float64
// 	AdjVolume   int64
// 	DivCash     float64
// 	SplitFactor float64
// }

// // Signal represents a trading intent emitted by a strategy.
// type Signal int

// const (
// 	Hold Signal = iota
// 	Buy
// 	Sell
// )

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

type Result struct {
	Configuration Backtest `json:"config"`
	EndingCash    float64  `json:"endingCash"`
}

type Strategy struct {
	Name string `json:"name"` // file
}
