package backtesting

import (
	"os"

	"github.com/JosephPBaruch/strategies"
)

// type Backtest stuct {}

// type BACKTEST interface {
// 	Execute(back Bactest)(float64, error)
// 	GetStrategies() ([]Strategy, error)
// }

// func NewBacktesting() BACKTEST {
// 	return &Backtest{}
// }

func Execute(back Backtest) (float64, error) {
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

	profit := backtest(bars, startingCash, strategies.MaStrategy)

	return profit, nil
}

func GetStrategies() ([]Strategy, error) {

	// read strategies directory and return the file names in the strategies format
	dirEntries, err := os.ReadDir(strategies_dir)
	if err != nil {
		return []Strategy{}, err
	}

	strats := []Strategy{}

	for _, dir := range dirEntries {
		if dir.Name() != "go.mod" && dir.Name() != "go.sum" {
			strats = append(strats, Strategy{Name: dir.Name()})
		}

	}

	return strats, nil
}

// Backtest runs the provided StrategyFunc over bars.
// Behavior: each Buy signal attempts to buy one share (if cash available). Each Sell signal sells one oldest share (FIFO) if any exist.
// Remaining positions are liquidated at the final close price.
// Returns final balance and slice of executed trades.
func backtest(bars []strategies.Bar, startBalance float64, strat StrategyFunc) (float64) {
	if len(bars) == 0 {
		return startBalance
	}

	balance := startBalance
	account := []float64{} // purchase prices (FIFO)
	trades := []Trade{}

	// sliding windows for example strategies may be built by the strategy itself by inspecting bars.
	for i := range bars {
		sig := strat(i, bars)
		price := bars[i].Open

		switch sig {
		case strategies.Buy:
			if balance >= price {
				balance -= price
				account = append(account, price)
				trades = append(trades, Trade{Index: i, Type: strategies.Buy, Price: price})
			}
		case strategies.Sell:
			if len(account) > 0 {
				// remove oldest
				account = account[1:]
				balance += price
				trades = append(trades, Trade{Index: i, Type: strategies.Sell, Price: price})
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
			trades = append(trades, Trade{Index: len(bars) - 1, Type: strategies.Sell, Price: lastPrice})
		}
	}

	profit := balance - startBalance
	return profit
}
