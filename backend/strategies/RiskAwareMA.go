package strategies

// RiskAwareMaStrategy implements a Moving Average strategy with risk management
// This demonstrates how to use PortfolioState for position sizing and risk control
type RiskAwareMaStrategy struct {
	maxExposure float64 // Maximum portfolio exposure percentage (e.g., 80.0 for 80%)
}

// NewRiskAwareMaStrategy creates a new risk-aware MA strategy
// maxExposure: maximum percentage of portfolio to allocate to positions (0-100)
func NewRiskAwareMaStrategy(maxExposure float64) Strategy {
	if maxExposure <= 0 || maxExposure > 100 {
		maxExposure = 80.0 // Default to 80% max exposure
	}
	return &RiskAwareMaStrategy{
		maxExposure: maxExposure,
	}
}

// Name returns the strategy name
func (s *RiskAwareMaStrategy) Name() string {
	return "RiskAwareMA"
}

// Execute implements the Strategy interface with risk-aware decision making
func (s *RiskAwareMaStrategy) Execute(i int, bars []Bar, portfolio PortfolioState) Signal {
	// Need at least 50 bars for MA calculation
	if i < 49 {
		return Hold
	}

	// Calculate 10 and 50 period moving averages
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

	// RISK MANAGEMENT LOGIC USING PORTFOLIO STATE

	// Buy signal: short MA crosses above long MA
	if shortMA > longMA {
		// Risk check 1: Don't buy if we're already at max exposure
		if portfolio.ExposurePercent >= s.maxExposure {
			return Hold // Already at risk limit
		}

		// Risk check 2: Don't buy if we have insufficient cash
		if portfolio.Cash < portfolio.CurrentPrice {
			return Hold // Not enough cash
		}

		// Risk check 3: Position sizing - only buy if it won't exceed max exposure
		// Calculate what our exposure would be after buying one more share
		newPositionValue := (float64(portfolio.NumShares) + 1) * portfolio.CurrentPrice
		newExposure := (newPositionValue / portfolio.TotalValue) * 100

		if newExposure > s.maxExposure {
			return Hold // Would exceed risk limit
		}

		return Buy
	}

	// Sell signal: short MA crosses below long MA
	if shortMA < longMA {
		// Risk check: Only sell if we have positions
		if portfolio.NumShares == 0 {
			return Hold // Nothing to sell
		}

		// Risk check: Consider unrealized P&L
		// If we're sitting on large losses, might want to cut losses
		if portfolio.UnrealizedPnL < 0 {
			// Loss is more than 10% of initial capital - cut losses
			if portfolio.UnrealizedPnL < -0.1*portfolio.InitialCapital {
				return Sell // Stop loss triggered
			}
		}

		return Sell
	}

	// ADDITIONAL RISK CHECKS even when no signal

	// Stop-loss: If unrealized losses exceed 15% of initial capital, sell
	if portfolio.NumShares > 0 && portfolio.UnrealizedPnL < -0.15*portfolio.InitialCapital {
		return Sell // Emergency stop-loss
	}

	// Take profit: If unrealized gains exceed 50% of initial capital, take some profit
	if portfolio.NumShares > 0 && portfolio.UnrealizedPnL > 0.5*portfolio.InitialCapital {
		return Sell // Take profits
	}

	return Hold
}
