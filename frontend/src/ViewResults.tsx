import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { GetResults } from "./Fetch";
import Typography from "@mui/material/Typography";

export interface ResultsDialogProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export function ViewResults({
  id,
  open,
  onClose,
}: ResultsDialogProps): React.ReactElement {
  const [results, setResults] = useState();

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
        <Typography>{results != null && String(results)}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
