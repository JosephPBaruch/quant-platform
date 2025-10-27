export interface Values {
  ticker: string;
  start: string;
  end: string;
  increment: string;
  startingCash: number;
}

export interface Backtest {
  Id: string;
  Name: string;
  Params: Values;
  EndingCash: number;
}
