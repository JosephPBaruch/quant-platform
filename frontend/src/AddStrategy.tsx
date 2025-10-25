import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { PostBacktest } from "./Fetch";

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
  // TODO: Get the strategies

  const onRun = async () => {
    try {
      //   await PostStrategy(values);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Strategy</DialogTitle>
      <DialogContent>{/* Select */}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => onRun()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
