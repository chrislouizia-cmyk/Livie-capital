import { portfolioSnapshot } from "@/data/portfolio";
import type { Position } from "@/types/finance";

export const exposureSummary = {
  gross: portfolioSnapshot.grossExposure,
  net: portfolioSnapshot.netExposure,
};

export const positions: Position[] = [
  {
    asset: "VTI",
    direction: "Long",
    quantity: 2100,
    entryPrice: 296.4,
    currentPrice: 304.18,
    stopLoss: 287.5,
    takeProfit: 318,
    currency: "USD",
    riskPerTradePercent: 0.36,
  },
  {
    asset: "NAFTRAC",
    direction: "Long",
    quantity: 38500,
    entryPrice: 55.9,
    currentPrice: 57.42,
    stopLoss: 53.8,
    takeProfit: 61,
    currency: "USD",
    riskPerTradePercent: 0.42,
  },
  {
    asset: "GBPUSD",
    direction: "Short",
    quantity: 0.2,
    entryPrice: 18.51,
    currentPrice: 18.44,
    stopLoss: 18.72,
    takeProfit: 18.1,
    currency: "USD",
    riskPerTradePercent: 0.18,
  },
  {
    asset: "QQQ",
    direction: "Long",
    quantity: 900,
    entryPrice: 467.25,
    currentPrice: 463.8,
    stopLoss: 452,
    takeProfit: 492,
    currency: "USD",
    riskPerTradePercent: 0.55,
  },
];
