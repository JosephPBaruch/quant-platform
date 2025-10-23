package backtesting

func Execute(back Backtest) (float64, error) {
	ticker := back.Ticker
	start := back.Start
	end := back.End
	increment := back.Increment
	startingCash := 10000.0

	fileName, err := fetchDataToCSV(ticker, start, end, increment)
	if err != nil {
		return 0.0, err
	}

	bars, err := loadBarsFromCSV(fileName)
	if err != nil {
		return 0.0, err
	}

	profit, _ := BacktestFunc(bars, startingCash, maStrategy)

	return profit, nil
}
