package backtesting

import (
	"os"

	"github.com/JosephPBaruch/backtesting/strategies"
)

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

	profit, _ := BacktestFunc(bars, startingCash, strategies.MaStrategy)

	return profit, nil
}

func GetStrategies() ([]Strategy, error) {

	// read strategies directory and return the file names in the strategies format
	dirEntries, err := os.ReadDir("./backtesting/strategies")
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
