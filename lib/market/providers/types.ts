export type MarketSymbol = "XAUUSD" | "GBPUSD" | "SPY" | "QQQ";

export type MarketAssetClass = "commodity" | "forex" | "etf";

export type MarketQuote = {
  symbol: MarketSymbol;
  name: string;
  assetClass: MarketAssetClass;
  currency: "USD";
  price: number;
  dailyChange: number;
  dailyChangePercent: number;
  lastUpdated: string;
};

export type DailyChange = Pick<
  MarketQuote,
  "dailyChange" | "dailyChangePercent"
>;

export type MarketDataProvider = {
  name: string;
  getQuote: (symbol: MarketSymbol) => Promise<MarketQuote | null>;
  getQuotes: (symbols?: MarketSymbol[]) => Promise<MarketQuote[]>;
  getCurrentPrice: (symbol: MarketSymbol) => Promise<number | null>;
  getDailyChange: (symbol: MarketSymbol) => Promise<DailyChange | null>;
  getLastUpdated: (symbol: MarketSymbol) => Promise<string | null>;
};

export const supportedMarketSymbols: MarketSymbol[] = [
  "XAUUSD",
  "GBPUSD",
  "SPY",
  "QQQ",
];
