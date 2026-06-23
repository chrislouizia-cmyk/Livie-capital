import type {
  DailyChange,
  MarketDataProvider,
  MarketQuote,
  MarketSymbol,
} from "@/lib/market/providers/types";
import { supportedMarketSymbols } from "@/lib/market/providers/types";

const mockQuotes: Record<MarketSymbol, MarketQuote> = {
  XAUUSD: {
    symbol: "XAUUSD",
    name: "Gold Spot",
    assetClass: "commodity",
    currency: "USD",
    price: 2328.4,
    dailyChange: 18.7,
    dailyChangePercent: 0.81,
    lastUpdated: "2026-06-22T14:30:00Z",
  },
  GBPUSD: {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    assetClass: "forex",
    currency: "USD",
    price: 1.2742,
    dailyChange: -0.0031,
    dailyChangePercent: -0.24,
    lastUpdated: "2026-06-22T14:30:00Z",
  },
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    assetClass: "etf",
    currency: "USD",
    price: 542.18,
    dailyChange: 2.19,
    dailyChangePercent: 0.41,
    lastUpdated: "2026-06-22T14:30:00Z",
  },
  QQQ: {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    assetClass: "etf",
    currency: "USD",
    price: 463.8,
    dailyChange: 2.91,
    dailyChangePercent: 0.63,
    lastUpdated: "2026-06-22T14:30:00Z",
  },
};

async function getQuote(symbol: MarketSymbol): Promise<MarketQuote | null> {
  return mockQuotes[symbol] ?? null;
}

async function getQuotes(symbols = supportedMarketSymbols): Promise<MarketQuote[]> {
  return symbols
    .map((symbol) => mockQuotes[symbol])
    .filter((quote): quote is MarketQuote => Boolean(quote));
}

async function getCurrentPrice(symbol: MarketSymbol): Promise<number | null> {
  const quote = await getQuote(symbol);
  return quote?.price ?? null;
}

async function getDailyChange(symbol: MarketSymbol): Promise<DailyChange | null> {
  const quote = await getQuote(symbol);

  if (!quote) {
    return null;
  }

  return {
    dailyChange: quote.dailyChange,
    dailyChangePercent: quote.dailyChangePercent,
  };
}

async function getLastUpdated(symbol: MarketSymbol): Promise<string | null> {
  const quote = await getQuote(symbol);
  return quote?.lastUpdated ?? null;
}

export const mockMarketDataProvider: MarketDataProvider = {
  name: "mock",
  getQuote,
  getQuotes,
  getCurrentPrice,
  getDailyChange,
  getLastUpdated,
};
