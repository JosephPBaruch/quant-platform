import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { GetStrategies, PostStrategy } from "./Fetch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export interface Values {
  ticker: string;
  start: string;
  end: string;
  increment: string;
  startingCash: number;
}

export interface Backtest {
  Id: String;
  Name: String;
  Params: Values;
}

const defaultValues: Values = {
  ticker: "AAPL",
  start: "2006-1-1",
  end: "2008-1-1",
  increment: "daily",
  startingCash: 10000,
};

export interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddStrategy({
  open,
  onClose,
}: DialogProps): React.ReactElement {
  const [strat, setStrat] = useState<string[]>([]);
  const [selected, setSelected] = useState("");

  const fetchStrats = async () => {
    try {
      const strategies = await GetStrategies();
      setStrat(strategies);
    } catch (err) {
      console.error("Error fetching strategies:", err);
    }
  };

  useEffect(() => {
    fetchStrats();
  }, [open]);

  const onRun = async () => {
    try {
      await PostStrategy(selected);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Strategy</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="select-strategy">Strategies</InputLabel>
          <Select
            labelId="select-strategy"
            value={selected}
            label="Strategies"
            onChange={(e) => setSelected(e.target.value)}
          >
            {strat.length > 0 &&
              strat.map((s) => <MenuItem value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => onRun()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
