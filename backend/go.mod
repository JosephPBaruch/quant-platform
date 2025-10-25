module example.com/todoapi

go 1.24.3

require github.com/JosephPBaruch/react-go-sandbox/backend/backtesting v0.0.0

require github.com/JosephPBaruch/backtesting/strategies v0.0.0 // indirect

require (
	github.com/google/uuid v1.6.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
)

replace github.com/JosephPBaruch/react-go-sandbox/backend/backtesting => ./backtesting

replace github.com/JosephPBaruch/backtesting/strategies => ./backtesting/strategies
