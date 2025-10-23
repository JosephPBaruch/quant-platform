import { useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BacktestingConfigurator, Values } from "./ConfigurationDialog";
import { GetBacktest } from "./Fetch";

export interface Response {
  config: Values;
  endingCash: number;
}

function App() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Response | undefined>(undefined);


   const fetchData = async () => {
      try {
        const result = await GetBacktest();

        setData(result);
      } catch (err) {
        console.error("Error fetching backtest:", err);
      }
    };

  const config: {label: string, key: keyof Values}[] = [
    {
      label: "Ticker",
      key: "Ticker"
    },
    {
      label: "Start",
      key: "Start"
    },
    {
      label: "End",
      key: "End"
    },
    {
      label: "Increment",
      key: "Increment"
    },
    {
      label: "Starting Cash", 
      key: "StartingCash"
    }
  ]

  return (
    <>
      <Typography>Backtesting</Typography>

      {data !== undefined && config.map((s) => (
        <Typography key={s.key}>{s.label}: {String(data.config[s.key])}</Typography>
      ))}
      {data !== undefined && <Typography>Ending Cash: {data.endingCash}</Typography>}

      <Button onClick={() => setOpen(!open)}>Open/Close</Button>

      {open && (
        <BacktestingConfigurator
          open={open}
          onClose={() => {
            setOpen(false);
            fetchData();
          }}
        />
      )}
    </>
  );
}

export default App;
