# Frontend

React + Vite + Material UI interface for configuring backtests and viewing results.

## Prerequisites

- Node.js and npm
- Backend running at http://localhost:8080 (see repository root README for backend instructions)

## Run the app

Use the pipeline script (runs `npm run dev` under the hood):

```sh
cd frontend
./pipeline.sh
```

Vite will start the dev server (typically at http://localhost:5173). The UI expects the backend at http://localhost:8080.

If you change the backend port or host, update the fetch URLs in `src/Fetch.ts`.

## Tech

- React 19, Vite 7
- MUI (Material UI) for components and theming
- Styling consolidated with `makeStyles` where applicable

## Project layout

- `src/App.tsx` — main UI with strategy table and actions
- `src/AddStrategy.tsx` — dialog to add a new strategy
- `src/ViewResults.tsx` — dialog to view backtest results
- `src/Fetch.ts` — API calls to the backend
