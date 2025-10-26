import { Backtest } from "./AddStrategy";

export const PostBacktest = async (backtest: Backtest): Promise<void> => {
  const response = await fetch(
    `http://localhost:8080/backtest/${backtest.Id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backtest),
    }
  );

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
};

export const GetResults = async (id: string) => {
  const response = await fetch(`http://localhost:8080/backtest/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const raw = await response.json();

  return raw;
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

  let ret: Backtest[] = [];

  raw.forEach((element: Backtest) => {
    ret.push(element);
  });

  return ret;
};

export const GetStrategies = async () => {
  const response = await fetch("http://localhost:8080/strategies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const raw = await response.json();

  let ret: string[] = [];

  raw.forEach((element: { name: string }) => {
    ret.push(element.name);
  });

  return ret;
};

export const PostStrategy = async (name: string): Promise<void> => {
  const response = await fetch("http://localhost:8080/backtest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }
};
