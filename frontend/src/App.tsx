import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Backtest, BacktestingConfigurator, Values } from "./ConfigurationDialog";
import { GetBacktest } from "./Fetch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

export interface Response {
  config: Values;
  endingCash: number;
}

function App() {
  const [open, setOpen] = useState(false);
  const [tableVals, setTableVals] = useState<Backtest[] | undefined>(undefined)


   const fetchData = async () => {
      try {
        const result = await GetBacktest();

        setTableVals(result);
      } catch (err) {
        console.error("Error fetching backtest:", err);
      }
    };

  useEffect(() => {
    fetchData();
  }, [])

  // const config: {label: string, key: keyof Values}[] = [
  //   {
  //     label: "Ticker",
  //     key: "Ticker"
  //   },
  //   {
  //     label: "Start",
  //     key: "Start"
  //   },
  //   {
  //     label: "End",
  //     key: "End"
  //   },
  //   {
  //     label: "Increment",
  //     key: "Increment"
  //   },
  //   {
  //     label: "Starting Cash", 
  //     key: "StartingCash"
  //   }
  // ]

  return (
    <>
      <Typography>Backtesting</Typography>

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
      <TableContainer>
            <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nam</TableCell>
          <TableCell>Ticker</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell>Increment</TableCell>
          <TableCell>Starting Cash</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableVals !== undefined && 
          tableVals.map((val) => (
            <>
            <TableCell>{val.Name}</TableCell>
          <TableCell>{val.Params.ticker}</TableCell>
          <TableCell>{val.Params.start}</TableCell>
          <TableCell>{val.Params.end}</TableCell>
          <TableCell>{val.Params.increment}</TableCell>
          <TableCell>{val.Params.startingCash}</TableCell>
          </>
          ))


        }

          


      </TableBody>
    </Table>
      </TableContainer>


    </>
  );
}

export default App;
