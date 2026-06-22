import { equityCurve } from "@/data/portfolio";
import { positions } from "@/data/positions";
import { trades } from "@/data/trades";
import type { EquityPoint, Position, Trade } from "@/types/finance";

export type PerformanceSummary = {
  totalReturn: number;
  profitLoss: number;
  winRate: number;
  maximumDrawdown: number;
  riskPerTrade: number;
  sharpeRatio: number;
};

function calculatePositionReturn(position: Position): number {
  if (position.entryPrice === 0) {
    return 0;
  }

  const rawReturn =
    position.direction === "Short"
      ? (position.entryPrice - position.currentPrice) / position.entryPrice
      : (position.currentPrice - position.entryPrice) / position.entryPrice;

  return rawReturn * 100;
}

function calculatePeriodicReturns(curve: EquityPoint[]): number[] {
  return curve.slice(1).map((point, index) => {
    const previousValue = curve[index].value;

    if (previousValue === 0) {
      return 0;
    }

    return (point.value - previousValue) / previousValue;
  });
}

export function calculateTotalReturn(curve: EquityPoint[] = equityCurve): number {
  const first = curve.at(0);
  const last = curve.at(-1);

  if (!first || !last || first.value === 0) {
    return 0;
  }

  return ((last.value - first.value) / first.value) * 100;
}

export function calculateProfitLoss(
  curve: EquityPoint[] = equityCurve,
): number {
  const first = curve.at(0);
  const last = curve.at(-1);

  if (!first || !last) {
    return 0;
  }

  return last.value - first.value;
}

export function calculateWinRate(openPositions: Position[] = positions): number {
  if (openPositions.length === 0) {
    return 0;
  }

  const winningPositions = openPositions.filter(
    (position) => calculatePositionReturn(position) > 0,
  );

  return (winningPositions.length / openPositions.length) * 100;
}

export function calculateMaximumDrawdown(
  curve: EquityPoint[] = equityCurve,
): number {
  if (curve.length === 0) {
    return 0;
  }

  let peak = curve[0].value;
  let maxDrawdown = 0;

  for (const point of curve) {
    peak = Math.max(peak, point.value);

    if (peak === 0) {
      continue;
    }

    const drawdown = ((point.value - peak) / peak) * 100;
    maxDrawdown = Math.min(maxDrawdown, drawdown);
  }

  return maxDrawdown;
}

export function calculateRiskPerTrade(
  openPositions: Position[] = positions,
): number {
  if (openPositions.length === 0) {
    return 0;
  }

  const totalRisk = openPositions.reduce(
    (sum, position) => sum + position.riskPerTradePercent,
    0,
  );

  return totalRisk / openPositions.length;
}

export function calculateSharpeRatio(
  curve: EquityPoint[] = equityCurve,
  annualRiskFreeRate = 0,
): number {
  const returns = calculatePeriodicReturns(curve);

  if (returns.length < 2) {
    return 0;
  }

  const periodRiskFreeRate = annualRiskFreeRate / returns.length;
  const excessReturns = returns.map((value) => value - periodRiskFreeRate);
  const mean =
    excessReturns.reduce((sum, value) => sum + value, 0) / excessReturns.length;
  const variance =
    excessReturns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    (excessReturns.length - 1);
  const standardDeviation = Math.sqrt(variance);

  if (standardDeviation === 0) {
    return 0;
  }

  return (mean / standardDeviation) * Math.sqrt(returns.length);
}

export function calculateExecutedTradeCount(
  tradeHistory: Trade[] = trades,
): number {
  return tradeHistory.filter((trade) => trade.status === "Filled").length;
}

export function calculatePerformanceSummary(): PerformanceSummary {
  return {
    totalReturn: calculateTotalReturn(),
    profitLoss: calculateProfitLoss(),
    winRate: calculateWinRate(),
    maximumDrawdown: calculateMaximumDrawdown(),
    riskPerTrade: calculateRiskPerTrade(),
    sharpeRatio: calculateSharpeRatio(),
  };
}
