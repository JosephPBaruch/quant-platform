package strategies

// Bar represents a daily OHLCV bar and adjusted values from Tiingo CSV
type Bar struct {
	Date        string
	Close       float64
	High        float64
	Low         float64
	Open        float64
	Volume      int64
	AdjClose    float64
	AdjHigh     float64
	AdjLow      float64
	AdjOpen     float64
	AdjVolume   int64
	DivCash     float64
	SplitFactor float64
}

type Signal int

const (
	Hold Signal = iota
	Buy
	Sell
)
