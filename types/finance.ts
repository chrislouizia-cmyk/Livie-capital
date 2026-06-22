export type CurrencyCode = "MXN" | "USD";

export type PositionDirection = "Long" | "Short";

export type TradeSide = "Buy" | "Sell" | "Short" | "Cover" | "Hedge" | "Roll";

export type TradeStatus = "Filled" | "Live" | "Queued" | "Cancelled";

export type ReportPeriod = "Daily" | "Weekly" | "Monthly" | "Annual";

export type EquityPoint = {
  day: string;
  value: number;
};

export type PortfolioSnapshot = {
  nav: number;
  currency: CurrencyCode;
  dailyPnl: number;
  totalReturnPercent: number;
  riskReservePercent: number;
  deployedCapitalPercent: number;
  grossExposure: number;
  netExposure: number;
  mxnUsd: number;
};

export type Asset = {
  name: string;
  category: "Equity" | "Credit" | "Cash" | "Hedge";
  region: "US" | "Mexico" | "Global";
  weightPercent: number;
  marketValue: number;
  currency: CurrencyCode;
  colorClass: string;
};

export type Position = {
  asset: string;
  direction: PositionDirection;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  currency: CurrencyCode | "FX";
  riskPerTradePercent: number;
};

export type Trade = {
  time: string;
  symbol: string;
  side: TradeSide;
  quantity: number;
  quantityLabel?: string;
  price: number;
  priceLabel?: string;
  status: TradeStatus;
};

export type PerformanceMetric = {
  label: string;
  value: number;
  context: string;
  tone: string;
  format: "percent" | "currency" | "ratio" | "number";
};

export type Report = {
  period: ReportPeriod;
  title: string;
  date: string;
  detail: string;
  cadence: string;
};
