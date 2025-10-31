package backtesting

import (
	"fmt"
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

	var strategy strategies.Strategy

	switch strat {
	case "MovingAverage":
		fmt.Println("Executing MovingAverage")
		strategy = strategies.NewMovingAverageStrategy()
	case "RSI":
		fmt.Println("Executing RSI")
		strategy = strategies.NewRSIStrategy()
	case "RiskAwareMA":
		fmt.Println("Executing RiskAwareMA")
		strategy = strategies.NewRiskAwareMaStrategy(80.0)
	default:
		fmt.Println("Executing Default(MovingAverage)")
		strategy = strategies.NewMovingAverageStrategy()
	}

	profit := backtest(bars, startingCash, strategy)
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

// Backtest runs the provided Strategy over bars.
// Behavior: each Buy signal attempts to buy one share (if cash available). Each Sell signal sells one oldest share (FIFO) if any exist.
// Remaining positions are liquidated at the final close price.
// Returns the profit (final balance - startBalance).
func backtest(bars []strategies.Bar, startBalance float64, strat strategies.Strategy) float64 {
	if len(bars) == 0 {
		return startBalance
	}

	balance := startBalance
	account := []float64{} // purchase prices (FIFO)
	realizedPnL := 0.0

	// sliding windows for example strategies may be built by the strategy itself by inspecting bars.
	for i := range bars {
		price := bars[i].Open

		// Calculate portfolio state
		positionValue := float64(len(account)) * price
		unrealizedPnL := positionValue
		for _, purchasePrice := range account {
			unrealizedPnL -= purchasePrice
		}

		totalValue := balance + positionValue
		positionRatio := 0.0
		exposurePercent := 0.0
		if startBalance > 0 {
			positionRatio = positionValue / startBalance
		}
		if totalValue > 0 {
			exposurePercent = positionValue / totalValue * 100
		}

		portfolio := strategies.PortfolioState{
			Cash:            balance,
			Positions:       append([]float64{}, account...), // Copy to prevent modification
			NumShares:       len(account),
			InitialCapital:  startBalance,
			CurrentPrice:    price,
			UnrealizedPnL:   unrealizedPnL,
			RealizedPnL:     realizedPnL,
			TotalValue:      totalValue,
			PositionRatio:   positionRatio,
			ExposurePercent: exposurePercent,
		}

		sig := strat.Execute(i, bars, portfolio)

		switch sig {
		case strategies.Buy:
			if balance >= price {
				balance -= price
				account = append(account, price)
				// record trade if needed in the future
			}
		case strategies.Sell:
			if len(account) > 0 {
				// Calculate realized P&L
				soldPrice := account[0]
				realizedPnL += price - soldPrice
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
			soldPrice := account[0]
			realizedPnL += lastPrice - soldPrice
			account = account[1:]
			balance += lastPrice
			// record trade if needed in the future
		}
	}

	profit := balance - startBalance
	return profit
}
