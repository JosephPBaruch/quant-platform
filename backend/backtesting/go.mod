module github.com/JosephPBaruch/react-go-sandbox/backend/backtesting

go 1.24.3

require github.com/JosephPBaruch/backtesting/strategies v0.0.0

require github.com/joho/godotenv v1.5.1

require github.com/google/uuid v1.6.0 // indirect

replace github.com/JosephPBaruch/backtesting/strategies => ./strategies
