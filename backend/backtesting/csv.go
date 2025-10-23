package backtesting

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"
)

// loadBarsFromCSV reads the given CSV file path (with header) and returns a slice of Bar.
func loadBarsFromCSV(path string) ([]Bar, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("open csv: %w", err)
	}
	defer f.Close()

	r := csv.NewReader(f)

	// read header
	if _, err := r.Read(); err != nil {
		return nil, fmt.Errorf("read header: %w", err)
	}

	var bars []Bar
	for {
		rec, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read record: %w", err)
		}
		if len(rec) < 13 {
			return nil, fmt.Errorf("unexpected record length: %d", len(rec))
		}

		// parse numeric fields
		parseF := func(s string) (float64, error) {
			return strconv.ParseFloat(s, 64)
		}
		parseI := func(s string) (int64, error) {
			return strconv.ParseInt(s, 10, 64)
		}

		closeF, err := parseF(rec[1])
		if err != nil {
			return nil, fmt.Errorf("parse close %q: %w", rec[1], err)
		}
		highF, err := parseF(rec[2])
		if err != nil {
			return nil, fmt.Errorf("parse high %q: %w", rec[2], err)
		}
		lowF, err := parseF(rec[3])
		if err != nil {
			return nil, fmt.Errorf("parse low %q: %w", rec[3], err)
		}
		openF, err := parseF(rec[4])
		if err != nil {
			return nil, fmt.Errorf("parse open %q: %w", rec[4], err)
		}
		volI, err := parseI(rec[5])
		if err != nil {
			return nil, fmt.Errorf("parse volume %q: %w", rec[5], err)
		}
		adjCloseF, err := parseF(rec[6])
		if err != nil {
			return nil, fmt.Errorf("parse adjClose %q: %w", rec[6], err)
		}
		adjHighF, err := parseF(rec[7])
		if err != nil {
			return nil, fmt.Errorf("parse adjHigh %q: %w", rec[7], err)
		}
		adjLowF, err := parseF(rec[8])
		if err != nil {
			return nil, fmt.Errorf("parse adjLow %q: %w", rec[8], err)
		}
		adjOpenF, err := parseF(rec[9])
		if err != nil {
			return nil, fmt.Errorf("parse adjOpen %q: %w", rec[9], err)
		}
		adjVolI, err := parseI(rec[10])
		if err != nil {
			return nil, fmt.Errorf("parse adjVolume %q: %w", rec[10], err)
		}
		divCashF, err := parseF(rec[11])
		if err != nil {
			return nil, fmt.Errorf("parse divCash %q: %w", rec[11], err)
		}
		splitF, err := parseF(rec[12])
		if err != nil {
			return nil, fmt.Errorf("parse splitFactor %q: %w", rec[12], err)
		}

		bars = append(bars, Bar{
			Date:        rec[0],
			Close:       closeF,
			High:        highF,
			Low:         lowF,
			Open:        openF,
			Volume:      volI,
			AdjClose:    adjCloseF,
			AdjHigh:     adjHighF,
			AdjLow:      adjLowF,
			AdjOpen:     adjOpenF,
			AdjVolume:   adjVolI,
			DivCash:     divCashF,
			SplitFactor: splitF,
		})
	}

	return bars, nil
}
