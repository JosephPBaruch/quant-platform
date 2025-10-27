package strategies

import "math"

// rsi computes the 14-period Relative Strength Index ending at index i.
// It returns (rsiValue, ok). ok == false if there wasn't enough data.
func rsi(i int, bars []Bar, period int) (float64, bool) {
	// need period+1 closes to get `period` deltas
	if i < period {
		return 0, false
	}

	gainSum := 0.0
	lossSum := 0.0

	// walk backwards from i-period+1 .. i
	// compute differences between consecutive AdjClose values
	for j := i - period + 1; j <= i; j++ {
		change := bars[j].AdjClose - bars[j-1].AdjClose
		if change > 0 {
			gainSum += change
		} else if change < 0 {
			lossSum += -change // store loss as positive
		}
	}

	avgGain := gainSum / float64(period)
	avgLoss := lossSum / float64(period)

	// handle edge cases:
	switch {
	case avgLoss == 0 && avgGain == 0:
		// literally flat for 'period' days -> define RSI = 50 neutral
		return 50.0, true
	case avgLoss == 0:
		// only went up, no losses -> RSI max
		return 100.0, true
	case avgGain == 0:
		// only went down, no gains -> RSI min
		return 0.0, true
	}

	// RS = avgGain / avgLoss
	rs := avgGain / avgLoss

	// RSI = 100 - (100 / (1 + RS))
	rsi := 100.0 - (100.0 / (1.0+rs))

	// numeric safety (not strictly required, but nice)
	if math.IsNaN(rsi) || math.IsInf(rsi, 0) {
		return 0, false
	}

	return rsi, true
}

// RsiStrategy is a simple momentum/mean-reversion strategy using 14-day RSI.
// Rules:
//   - RSI < 30  => Buy  (oversold, expecting bounce)
//   - RSI > 70  => Sell (overbought, expecting pullback)
//   - else      => Hold
func RsiStrategy(i int, bars []Bar) Signal {
	const period = 14

	val, ok := rsi(i, bars, period)
	if !ok {
		return Hold
	}

	if val < 30.0 {
		return Buy
	}
	if val > 70.0 {
		return Sell
	}
	return Hold
}
