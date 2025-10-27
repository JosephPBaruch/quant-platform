package backtesting

import (
	"os"
	"strings"

	"github.com/JosephPBaruch/strategies"
)

// BACKTEST describes the behavior for executing a backtest and listing strategies.
type BACKTEST interface {
	Execute(strat string, back Backtest) (float64, error)
	GetStrategies() ([]Strategy, error)
}

// back is a concrete implementation of Backtesting.
type back struct{}

// NewBacktesting returns a Backtesting implementation.
func NewBacktesting() BACKTEST { return &back{} }

func (s *back) Execute(strat string, back Backtest) (float64, error) {
	ticker := back.Ticker
	start := back.Start
	end := back.End
	increment := back.Increment
	startingCash := back.StartingCash

	fileName, err := fetchDataToCSV(ticker, start, end, increment)
	if err != nil {
		return 0.0, err
	}

	bars, err := loadBarsFromCSV(fileName)
	if err != nil {
		return 0.0, err
	}

	err = os.Remove(fileName)
	if err != nil {
		return 0.0, err
	}

	var profit float64

	switch strat{
		case "maStrategy":
			profit = backtest(bars, startingCash, strategies.MaStrategy)
		case "rsi":
			profit = backtest(bars, startingCash, strategies.RsiStrategy)
		default:
			profit = backtest(bars, startingCash, strategies.MaStrategy)
	}
	
	return profit, nil
}

func (s *back) GetStrategies() ([]Strategy, error) {
	dirEntries, err := os.ReadDir(strategies_dir)
	if err != nil {
		return nil, err
	}

	var strats []Strategy

	for _, dir := range dirEntries {
		name := dir.Name()
		if name == "go.mod" || name == "go.sum" || name == "types.go" {
			continue
		}

		name = strings.TrimSuffix(name, ".go")

		strats = append(strats, Strategy{Name: name})
	}

	return strats, nil
}

// Backtest runs the provided StrategyFunc over bars.
// Behavior: each Buy signal attempts to buy one share (if cash available). Each Sell signal sells one oldest share (FIFO) if any exist.
// Remaining positions are liquidated at the final close price.
// Returns the profit (final balance - startBalance).
func backtest(bars []strategies.Bar, startBalance float64, strat StrategyFunc) float64 {
	if len(bars) == 0 {
		return startBalance
	}

	balance := startBalance
	account := []float64{} // purchase prices (FIFO)

	// sliding windows for example strategies may be built by the strategy itself by inspecting bars.
	for i := range bars {
		sig := strat(i, bars)
		price := bars[i].Open

		switch sig {
		case strategies.Buy:
			if balance >= price {
				balance -= price
				account = append(account, price)
				// record trade if needed in the future
			}
		case strategies.Sell:
			if len(account) > 0 {
				// remove oldest
				account = account[1:]
				balance += price
				// record trade if needed in the future
			}
		case strategies.Hold:
			// do nothing
		}
	}

	// Liquidate any remaining positions at last close
	if len(account) > 0 {
		lastPrice := bars[len(bars)-1].Close
		for len(account) > 0 {
			account = account[1:]
			balance += lastPrice
			// record trade if needed in the future
		}
	}

	profit := balance - startBalance
	return profit
}
