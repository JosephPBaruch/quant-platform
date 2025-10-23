import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { PostBacktest } from "./Fetch"

export interface Values  {
  Ticker: string
  Start: string
  End: string
  Increment: string
  StartingCash: number
}

const defaultValues: Values = {
  Ticker: "AAPL",
  Start: "2006-1-1",
  End: "2008-1-1",
  Increment: "daily",
  StartingCash: 10000,
}

export interface DialogProps {
  open: boolean
  onClose: () => void
}

export function BacktestingConfigurator({open, onClose}: DialogProps): React.ReactElement {
  const [values, setValues] = useState<Values>(defaultValues)

  const fields: { label: string; id: string; key: keyof Values; type?: string }[] = [
    { label: "Ticker", id: "ticker", key: "Ticker" },
    { label: "Start", id: "start", key: "Start" },
    { label: "End", id: "end", key: "End" },
    { label: "Increment", id: "increment", key: "Increment" },
    { label: "Starting Cash", id: "startingCash", key: "StartingCash", type: "number" },
  ]

  const onRun = async () => {
    try {
      await PostBacktest(values)
      onClose()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Backtesting configuration</DialogTitle>
      <DialogContent>
        {fields.map((f) => (
          <TextField
            key={f.id}
            label={f.label}
            id={f.id}
            margin="dense"
            fullWidth
            type={f.type ?? "text"}
            value={String(values[f.key])}
            onChange={(e) => {
              const v = f.type === "number" ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value
              setValues((prev) => ({ ...prev, [f.key]: v } as Values))
            }}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" onClick={() => onRun()}>Run</Button>
      </DialogActions>
    </Dialog>
  )
}