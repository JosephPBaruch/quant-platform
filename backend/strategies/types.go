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

// PortfolioState represents the current state of the portfolio
type PortfolioState struct {
	Cash            float64   // Available cash
	Positions       []float64 // Purchase prices of held shares (FIFO order)
	NumShares       int       // Number of shares currently held
	InitialCapital  float64   // Starting capital
	CurrentPrice    float64   // Current bar price
	UnrealizedPnL   float64   // Unrealized profit/loss on open positions
	RealizedPnL     float64   // Realized profit/loss from closed positions
	TotalValue      float64   // Cash + position value
	PositionRatio   float64   // Percentage of capital in positions (0.0 to 1.0)
	ExposurePercent float64   // Position value as % of total portfolio value
}

// Strategy defines the interface that all trading strategies must implement
type Strategy interface {
	// Execute evaluates the strategy at bar index i and returns a trading signal
	// Now receives portfolio state for risk-aware decision making
	Execute(i int, bars []Bar, portfolio PortfolioState) Signal
	// Name returns the human-readable name of the strategy
	Name() string
}
