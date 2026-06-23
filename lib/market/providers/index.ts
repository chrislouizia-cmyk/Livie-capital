import { mockMarketDataProvider } from "@/lib/market/providers/mockProvider";
import type {
  DailyChange,
  MarketDataProvider,
  MarketQuote,
  MarketSymbol,
} from "@/lib/market/providers/types";

export type {
  DailyChange,
  MarketAssetClass,
  MarketDataProvider,
  MarketQuote,
  MarketSymbol,
} from "@/lib/market/providers/types";
export { supportedMarketSymbols } from "@/lib/market/providers/types";
export { mockMarketDataProvider } from "@/lib/market/providers/mockProvider";

let activeProvider: MarketDataProvider = mockMarketDataProvider;

export function setMarketDataProvider(provider: MarketDataProvider): void {
  activeProvider = provider;
}

export function getMarketDataProvider(): MarketDataProvider {
  return activeProvider;
}

export async function getMarketQuotes(
  symbols?: MarketSymbol[],
): Promise<MarketQuote[]> {
  return activeProvider.getQuotes(symbols);
}

export async function getCurrentPrice(
  symbol: MarketSymbol,
): Promise<number | null> {
  return activeProvider.getCurrentPrice(symbol);
}

export async function getDailyChange(
  symbol: MarketSymbol,
): Promise<DailyChange | null> {
  return activeProvider.getDailyChange(symbol);
}

export async function getLastUpdated(
  symbol: MarketSymbol,
): Promise<string | null> {
  return activeProvider.getLastUpdated(symbol);
}
