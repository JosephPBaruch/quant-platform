import { useEffect, useState } from "react";
import "./App.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GetBacktest, PostBacktest } from "./Fetch";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { AddStrategy, Backtest, Values } from "./AddStrategy";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import { ViewResults } from "./ViewResults";

export interface Response {
  config: Values;
  endingCash: number;
}

function App() {
  const [openAddStrategy, setOpenAddStrategy] = useState(false);
  const [tableVals, setTableVals] = useState<Backtest[] | undefined>(undefined);
  const [viewId, setViewId] = useState("");

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

  const onRun = async (id: string) => {
    try {
      const item = tableVals?.find((item) => item.Id === id);
      if (!item) {
        console.error("No backtest found with id:", id);
        return;
      }

      await PostBacktest(item);
    } catch (err) {
      console.error("Error running backtesting:", err);
    }
  };

  return (
    <>
      <AppBar>
        <Typography variant="h5">Backtesting</Typography>
      </AppBar>
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
                      variant="standard"
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
                    <Button variant="contained" onClick={() => onRun(val.Id)}>
                      Run
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setViewId(val.Id)}
                    >
                      View Results
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {viewId != "" && (
        <ViewResults id={viewId} open={true} onClose={() => setViewId("")} />
      )}
    </>
  );
}

export default App;
