import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Backtest, Values } from "./ConfigurationDialog";
import { GetBacktest } from "./Fetch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { AddStrategy } from "./AddStrategy";
import TextField from "@mui/material/TextField";

export interface Response {
  config: Values;
  endingCash: number;
}

function App() {
  const [openAddStrategy, setOpenAddStrategy] = useState(false);
  const [tableVals, setTableVals] = useState<Backtest[] | undefined>(undefined);

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
  }, []);

  const handleTableCellChange = (
    targetId: string,
    value: string,
    target: string
  ) => {
    setTableVals((prev) =>
      prev
        ? prev.map((item) =>
            item.Id === targetId ? { ...item, [target]: value } : item
          )
        : prev
    );
  };

  const handleParamChange = (
    targetId: string,
    field: string,
    value: string
  ) => {
    setTableVals((prev) =>
      prev
        ? prev.map((item) =>
            item.Id === targetId
              ? { ...item, Params: { ...item.Params, [field]: value as any } }
              : item
          )
        : prev
    );
  };

  return (
    <>
      <Typography>Backtesting</Typography>
      <Button variant="contained" onClick={() => setOpenAddStrategy(true)}>
        Add Strategy
      </Button>
      <AddStrategy
        open={openAddStrategy}
        onClose={() => setOpenAddStrategy(false)}
      />
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
                <TableRow key={val.Id}>
                  <TableCell>
                    <TextField
                      value={val.Name}
                      onChange={(e) =>
                        handleTableCellChange(val.Id, e.target.value, "Name")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={val.Params.ticker}
                      onChange={(e) =>
                        handleParamChange(val.Id, "ticker", e.target.value)
                      }
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={val.Params.start}
                      onChange={(e) =>
                        handleParamChange(val.Id, "start", e.target.value)
                      }
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={val.Params.end}
                      onChange={(e) =>
                        handleParamChange(val.Id, "end", e.target.value)
                      }
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={val.Params.increment}
                      onChange={(e) =>
                        handleParamChange(val.Id, "increment", e.target.value)
                      }
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={val.Params.startingCash as any}
                      onChange={(e) =>
                        handleParamChange(
                          val.Id,
                          "startingCash",
                          e.target.value
                        )
                      }
                      variant="standard"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
