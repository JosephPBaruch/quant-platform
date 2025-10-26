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
                <TableRow>
                  <TableCell>
                    <TextField
                      value={val.Name}
                      onChange={(e) =>
                        handleTableCellChange(val.Id, e.target.value, "Name")
                      }
                    />
                  </TableCell>
                  <TableCell>{val.Params.ticker}</TableCell>
                  <TableCell>{val.Params.start}</TableCell>
                  <TableCell>{val.Params.end}</TableCell>
                  <TableCell>{val.Params.increment}</TableCell>
                  <TableCell>{val.Params.startingCash}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;
