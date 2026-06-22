"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchMarketPrices,
  type MarketPrice,
} from "@/lib/marketData";

type UseMarketDataOptions = {
  symbols?: string[];
  refreshIntervalMs?: number;
  enabled?: boolean;
};

type UseMarketDataResult = {
  data: MarketPrice[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  getCurrentPrice: (symbol: string) => number | undefined;
  getDailyChange: (
    symbol: string,
  ) =>
    | Pick<MarketPrice, "dailyChange" | "dailyChangePercent">
    | undefined;
};

function normalizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

export function useMarketData({
  symbols,
  refreshIntervalMs = 30000,
  enabled = true,
}: UseMarketDataOptions = {}): UseMarketDataResult {
  const [data, setData] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const symbolSet = useMemo(() => {
    if (!symbols?.length) {
      return null;
    }

    return new Set(symbols.map(normalizeSymbol));
  }, [symbols]);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setError(null);
      const prices = await fetchMarketPrices();
      const filteredPrices = symbolSet
        ? prices.filter((asset) => symbolSet.has(asset.symbol))
        : prices;

      setData(filteredPrices);
      setLastUpdated(new Date());
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to refresh market data.",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, symbolSet]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const initialRefreshId = window.setTimeout(() => {
      void refresh();
    }, 0);

    const intervalId = window.setInterval(() => {
      void refresh();
    }, refreshIntervalMs);

    return () => {
      window.clearTimeout(initialRefreshId);
      window.clearInterval(intervalId);
    };
  }, [enabled, refresh, refreshIntervalMs]);

  const getMarketPrice = useCallback(
    (symbol: string) => {
      const normalizedSymbol = normalizeSymbol(symbol);

      return data.find((asset) => asset.symbol === normalizedSymbol);
    },
    [data],
  );

  const getCurrentPrice = useCallback(
    (symbol: string) => getMarketPrice(symbol)?.price,
    [getMarketPrice],
  );

  const getDailyChange = useCallback(
    (symbol: string) => {
      const asset = getMarketPrice(symbol);

      if (!asset) {
        return undefined;
      }

      return {
        dailyChange: asset.dailyChange,
        dailyChangePercent: asset.dailyChangePercent,
      };
    },
    [getMarketPrice],
  );

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    getCurrentPrice,
    getDailyChange,
  };
}
