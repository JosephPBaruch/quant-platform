package backtesting

// average computes arithmetic mean of a slice of float64. Returns 0 for empty slice.
func average(nums []float64) float64 {
	if len(nums) == 0 {
		return 0
	}
	sum := 0.0
	for _, v := range nums {
		sum += v
	}
	return sum / float64(len(nums))
}

// example 10/50 MA strategy implemented as a StrategyFunc
func maStrategy(i int, bars []Bar) Signal {
	// need at least 50 bars (i is index of current bar)
	if i < 49 {
		return Hold
	}
	// compute 10 and 50 MA over Open prices ending at i
	ten := make([]float64, 0, 10)
	fifty := make([]float64, 0, 50)
	for j := i - 9; j <= i; j++ {
		ten = append(ten, bars[j].Open)
	}
	for j := i - 49; j <= i; j++ {
		fifty = append(fifty, bars[j].Open)
	}
	shortMA := average(ten)
	longMA := average(fifty)
	if shortMA > longMA {
		return Buy
	}
	if shortMA < longMA {
		return Sell
	}
	return Hold
}
