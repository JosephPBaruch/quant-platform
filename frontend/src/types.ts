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
}

export interface Results {
  Strat: Backtest;
  EndCash: string;
}

export interface Response {
  config: Values;
  endingCash: number;
}
