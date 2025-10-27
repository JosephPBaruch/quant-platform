module github.com/JosephPBaruch/backtesting

go 1.24.3

require (
	github.com/JosephPBaruch/strategies v0.0.0
	github.com/joho/godotenv v1.5.1
)

replace github.com/JosephPBaruch/strategies => ./../strategies
