import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { GetResults } from "./Fetch";
import Typography from "@mui/material/Typography";
import { Backtest } from "./AddStrategy";
import Box from "@mui/material/Box";

export interface ResultsDialogProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export interface Results {
  Strat: Backtest;
  EndCash: string;
}

export function ViewResults({
  id,
  open,
  onClose,
}: ResultsDialogProps): React.ReactElement {
  const [results, setResults] = useState<Results>();

  const fetchResults = async () => {
    try {
      const finished = await GetResults(id);
      console.log(finished);
      setResults(finished);
    } catch (err) {
      console.error("Error fetching strategies:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Results</DialogTitle>
      <DialogContent>
        {!results ? (
          <Typography>Loading...</Typography>
        ) : (
          <Box component="div" sx={{ whiteSpace: "pre-wrap" }}>
            <Typography variant="h6">Ending Cash</Typography>
            <Typography>{results.EndCash}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Strategy
            </Typography>
            <Typography>Name: {results.Strat?.Name ?? "(no name)"}</Typography>

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Configuration
            </Typography>
            <Box component="pre" sx={{ p: 1, backgroundColor: "#f5f5f5" }}>
              {JSON.stringify(results.Strat?.Params ?? {}, null, 2)}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
