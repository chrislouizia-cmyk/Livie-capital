export type MarketAssetType = "commodity" | "forex" | "etf" | "equity";

export type MarketPrice = {
  symbol: string;
  name: string;
  type: MarketAssetType;
  currency: "USD";
  price: number;
  dailyChange: number;
  dailyChangePercent: number;
  updatedAt: string;
};

export const marketPrices: MarketPrice[] = [
  {
    symbol: "XAUUSD",
    name: "Gold Spot",
    type: "commodity",
    currency: "USD",
    price: 2328.4,
    dailyChange: 18.7,
    dailyChangePercent: 0.81,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    type: "forex",
    currency: "USD",
    price: 1.2742,
    dailyChange: -0.0031,
    dailyChangePercent: -0.24,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "etf",
    currency: "USD",
    price: 542.18,
    dailyChange: 2.19,
    dailyChangePercent: 0.41,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "etf",
    currency: "USD",
    price: 463.8,
    dailyChange: 2.91,
    dailyChangePercent: 0.63,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "equity",
    currency: "USD",
    price: 212.45,
    dailyChange: 1.18,
    dailyChangePercent: 0.56,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    type: "equity",
    currency: "USD",
    price: 486.2,
    dailyChange: 3.44,
    dailyChangePercent: 0.71,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    type: "equity",
    currency: "USD",
    price: 144.12,
    dailyChange: 2.86,
    dailyChangePercent: 2.02,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "equity",
    currency: "USD",
    price: 176.92,
    dailyChange: -0.84,
    dailyChangePercent: -0.47,
    updatedAt: "2026-06-21T14:30:00Z",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    type: "equity",
    currency: "USD",
    price: 612.35,
    dailyChange: 5.62,
    dailyChangePercent: 0.93,
    updatedAt: "2026-06-21T14:30:00Z",
  },
];

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

export function getMarketPrice(symbol: string): MarketPrice | undefined {
  const normalizedSymbol = normalizeSymbol(symbol);

  return marketPrices.find((asset) => asset.symbol === normalizedSymbol);
}

export function getCurrentPrice(symbol: string): number | undefined {
  return getMarketPrice(symbol)?.price;
}

export function getDailyChange(symbol: string):
  | Pick<MarketPrice, "dailyChange" | "dailyChangePercent">
  | undefined {
  const asset = getMarketPrice(symbol);

  if (!asset) {
    return undefined;
  }

  return {
    dailyChange: asset.dailyChange,
    dailyChangePercent: asset.dailyChangePercent,
  };
}

export function getTechnologyStocks(): MarketPrice[] {
  return marketPrices.filter((asset) =>
    ["AAPL", "MSFT", "NVDA", "GOOGL", "META"].includes(asset.symbol),
  );
}

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  return marketPrices;
}
