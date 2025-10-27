module github.com/JosephPBaruch/backend

go 1.24.3

require (
	github.com/JosephPBaruch/backtesting v0.0.0
	github.com/google/uuid v1.6.0
)

require (
	github.com/JosephPBaruch/strategies v0.0.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
)

replace github.com/JosephPBaruch/backtesting => ./backtesting

replace github.com/JosephPBaruch/strategies => ./strategies
