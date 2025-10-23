package backtesting

import "fmt"

// Backtest runs the provided StrategyFunc over bars.
// Behavior: each Buy signal attempts to buy one share (if cash available). Each Sell signal sells one oldest share (FIFO) if any exist.
// Remaining positions are liquidated at the final close price.
// Returns final balance and slice of executed trades.
func BacktestFunc(bars []Bar, startBalance float64, strat StrategyFunc) (float64, []Trade) {
	if len(bars) == 0 {
		return startBalance, nil
	}

	balance := startBalance
	account := []float64{} // purchase prices (FIFO)
	trades := []Trade{}

	// sliding windows for example strategies may be built by the strategy itself by inspecting bars.
	for i := range bars {
		sig := strat(i, bars)
		price := bars[i].Open

		switch sig {
		case Buy:
			if balance >= price {
				balance -= price
				account = append(account, price)
				trades = append(trades, Trade{Index: i, Type: Buy, Price: price})
			}
		case Sell:
			if len(account) > 0 {
				// remove oldest
				account = account[1:]
				balance += price
				trades = append(trades, Trade{Index: i, Type: Sell, Price: price})
			}
		case Hold:
			// do nothing
		}
	}

	// Liquidate any remaining positions at last close
	if len(account) > 0 {
		lastPrice := bars[len(bars)-1].Close
		for len(account) > 0 {
			account = account[1:]
			balance += lastPrice
			trades = append(trades, Trade{Index: len(bars) - 1, Type: Sell, Price: lastPrice})
		}
	}

	profit := balance - startBalance
	fmt.Printf("Start: %.2f Final: %.2f Profit: %.2f\n", startBalance, balance, profit)
	return profit, trades
}
