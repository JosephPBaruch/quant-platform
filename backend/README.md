# Backend

Go HTTP API that powers the backtesting platform. Exposes endpoints to list strategies, stage backtests, run them, and fetch results.

## Requirements

- Go 1.22+
- Tiingo API token (for historical prices)
- Optional: Air (live-reload), used by `./pipeline.sh`

## Configuration

Create a `.env` file in this folder with:

```sh
TIINGO_TOKEN="tiingo-token-here"
```

The token is loaded at runtime (see `backtesting/fetch.go`). Prices are fetched via Tiingo’s daily endpoint and written to a temporary CSV, which is removed after processing.

## Run

Preferred (with live reload):

```sh
cd backend
./pipeline.sh
```

This uses `air` (see `.air.toml`). If you don’t have it installed, either install it (e.g. `brew install air`) or run the server directly:

```sh
go run .
```

The server listens on `http://localhost:8080` and uses Go 1.22’s ServeMux patterns (e.g., `"GET /path"`). CORS is enabled for development in `helpers.go`.

## API

- GET `/strategies`

  - Returns available strategy names discovered from `./strategies`. The server strips file extensions (e.g., `maStrategy.go` -> `maStrategy`).

- GET `/backtest`

  - Returns an array of backtest entries that have been staged via POST `/backtest`.
  - Shape: `[{ id, name, params, endingCash }]` where `params` is the config and `endingCash` is the last computed value.

- POST `/backtest`

  - Body: `{ "name": "maStrategy" }`
  - Adds a new entry to the in-memory store. Use the returned list (GET `/backtest`) to obtain the id.

- GET `/backtest/{id}`

  - Returns the stored entry for the given id.

- POST `/backtest/{id}`
  - Body (JSON):
    ```json
    {
      "ticker": "AAPL",
      "start": "2006-1-1",
      "end": "2008-1-1",
      "increment": "daily",
      "startingCash": 10000
    }
    ```
  - Runs the backtest for the given entry using its selected strategy and updates `endingCash` and `params` in memory.

## Backtesting module

- Package: `backtesting/`
- Entry points:
  - Interface `BACKTEST` with methods `Execute(strat string, back Backtest)` and `GetStrategies()`.
  - `NewBacktesting()` returns a concrete implementation used by the service layer.
  - `Execute` fetches prices from Tiingo, converts to bars, runs the chosen strategy, and returns profit.
  - Available strategies are discovered from `./strategies` and currently include `maStrategy` (moving average). Unknown names default to `maStrategy`.

## Notes

- CSV-based ingest is kept because Tiingo indicates it’s significantly faster. Files are removed after processing.
- CORS middleware is permissive for local development. Restrict it for production.
