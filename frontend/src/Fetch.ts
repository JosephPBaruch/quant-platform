import { Values } from "./ConfigurationDialog";

export const PostBacktest = async (data: Values): Promise<void> => {
  // Map UI values to API payload keys expected by Go backend
  const payload = {
    ticker: data.Ticker,
    start: data.Start,
    end: data.End,
    increment: data.Increment,
    startingCash: data.StartingCash,
  };

  const response = await fetch("http://localhost:8080/backtest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
  // POST returns an empty body; nothing to parse
};

export const GetBacktest = async (): Promise<{ config: Values; endingCash: number }> => {
  const response = await fetch("http://localhost:8080/backtest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const raw = await response.json();
  // Map API response to UI-friendly shape
  const mapped = {
    config: {
      Ticker: raw.config?.ticker ?? "",
      Start: raw.config?.start ?? "",
      End: raw.config?.end ?? "",
      Increment: raw.config?.increment ?? "",
      StartingCash: raw.config?.startingCash ?? 0,
    },
    endingCash: raw.endingCash ?? 0,
  } as const;

  return mapped;
};