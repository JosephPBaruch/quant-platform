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
import { makeStyles } from "@mui/styles";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import InsightsIcon from "@mui/icons-material/Insights";

const useStyles = makeStyles((theme: any) => ({
  dialogTitle: { paddingBottom: theme.spacing ? theme.spacing(1) : 8 },
  divider: { marginTop: theme.spacing ? theme.spacing(1) : 8 },
  dialogContent: { paddingTop: theme.spacing ? theme.spacing(2) : 16 },
  endCashBox: {
    display: "flex",
    alignItems: "baseline",
    gap: theme.spacing ? theme.spacing(1) : 8,
    padding: theme.spacing ? theme.spacing(2) : 16,
    borderRadius: 4,
    backgroundColor:
      theme.palette && theme.palette.success
        ? theme.palette.success.light
        : "#e8f5e9",
    color:
      theme.palette && theme.palette.success && theme.palette.getContrastText
        ? theme.palette.getContrastText(theme.palette.success.light)
        : "#1b5e20",
  },
  sectionLabel: {
    color:
      theme.palette && theme.palette.text
        ? theme.palette.text.secondary
        : "#6b7280",
  },
  configPre: {
    margin: 0,
    padding: theme.spacing ? theme.spacing(2) : 16,
    borderRadius: 4,
    overflow: "auto",
    backgroundColor:
      theme.palette && theme.palette.mode === "light"
        ? "#f5f5f5"
        : "rgba(255,255,255,0.06)",
    border:
      theme.palette && theme.palette.divider
        ? `1px solid ${theme.palette.divider}`
        : "1px solid rgba(0,0,0,0.12)",
  },
}));

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
  const classes = useStyles();
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className={classes.dialogTitle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <InsightsIcon color="primary" />
            <Typography variant="h6">Backtest Results</Typography>
          </Stack>
          <Button
            size="small"
            color="inherit"
            onClick={onClose}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Stack>
        <Divider className={classes.divider} />
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!results ? (
          <Typography>Loading...</Typography>
        ) : (
          <Stack spacing={2}>
            <Box className={classes.endCashBox}>
              <Typography variant="subtitle2">Ending Cash</Typography>
              <Typography variant="h5" fontWeight={700}>
                {results.EndCash}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" className={classes.sectionLabel}>
                Strategy
              </Typography>
              <Typography>
                Name: {results.Strat?.Name ?? "(no name)"}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" className={classes.sectionLabel}>
                Configuration
              </Typography>
              <Box component="pre" className={classes.configPre}>
                {JSON.stringify(results.Strat?.Params ?? {}, null, 2)}
              </Box>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => onClose()} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
