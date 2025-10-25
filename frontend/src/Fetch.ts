import { Backtest, Values } from "./ConfigurationDialog";

export const PostBacktest = async (data: Values): Promise<void> => {
  // Map UI values to API payload keys expected by Go backend
  const payload = {
    ticker: data.ticker,
    start: data.start,
    end: data.end,
    increment: data.increment,
    startingCash: data.startingCash,
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

export const GetBacktest = async () => {
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

  let ret:Backtest[] = []

  raw.forEach((element: Backtest) => {
    console.log("Hello")
    console.log(element)
    ret.push(element)
  });

  return ret;
};