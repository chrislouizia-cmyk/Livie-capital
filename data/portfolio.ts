import type {
  Asset,
  EquityPoint,
  PortfolioSnapshot,
  Report,
} from "@/types/finance";

export const portfolioSnapshot: PortfolioSnapshot = {
  nav: 12480000,
  currency: "USD",
  dailyPnl: 299000,
  totalReturnPercent: 24.8,
  riskReservePercent: 18,
  deployedCapitalPercent: 82,
  grossExposure: 1.18,
  netExposure: 0.82,
  usdFxRate: 18.44,
};

export const marketTape = [
  { label: "SPX 5,421.03", tone: "text-zinc-300" },
  { label: "+0.41%", tone: "text-emerald-300" },
  { label: "NASDAQ 17,688.8", tone: "" },
  { label: "+0.63%", tone: "text-emerald-300" },
  { label: "GBPUSD 18.44", tone: "" },
  { label: "-0.12%", tone: "text-amber-300" },
  { label: "UST 10Y 4.28%", tone: "" },
];

export const assetAllocations: Asset[] = [
  {
    name: "US Equities",
    category: "Equity",
    region: "US",
    weightPercent: 34,
    marketValue: 4240000,
    currency: "USD",
    colorClass: "bg-emerald-400",
  },
  {
    name: "Mexican Equities",
    category: "Equity",
    region: "Mexico",
    weightPercent: 22,
    marketValue: 2750000,
    currency: "USD",
    colorClass: "bg-sky-300",
  },
  {
    name: "Private Credit",
    category: "Credit",
    region: "Global",
    weightPercent: 18,
    marketValue: 2250000,
    currency: "USD",
    colorClass: "bg-amber-300",
  },
  {
    name: "Cash Reserve",
    category: "Cash",
    region: "Mexico",
    weightPercent: 16,
    marketValue: 2000000,
    currency: "USD",
    colorClass: "bg-zinc-300",
  },
  {
    name: "Macro Hedges",
    category: "Hedge",
    region: "Global",
    weightPercent: 10,
    marketValue: 1240000,
    currency: "USD",
    colorClass: "bg-rose-300",
  },
];

export const deployedCapital = portfolioSnapshot.deployedCapitalPercent;

export const performanceReturns = [
  {
    period: "1M",
    value: "+2.4%",
    benchmark: "+0.8% vs benchmark",
    width: "38%",
  },
  {
    period: "3M",
    value: "+5.9%",
    benchmark: "+1.7% vs benchmark",
    width: "54%",
  },
  {
    period: "6M",
    value: "+9.6%",
    benchmark: "+2.9% vs benchmark",
    width: "68%",
  },
  {
    period: "YTD",
    value: "+12.8%",
    benchmark: "+4.1% vs benchmark",
    width: "78%",
  },
  {
    period: "Since Inception",
    value: "+17.0%",
    benchmark: "+6.3% vs benchmark",
    width: "92%",
  },
];

export const equityCurve: EquityPoint[] = [
  { day: "Jan", value: 10000000 },
  { day: "Feb", value: 10850000 },
  { day: "Mar", value: 10680000 },
  { day: "Apr", value: 11340000 },
  { day: "May", value: 11960000 },
  { day: "Jun", value: 12480000 },
];

export const strategySections = [
  {
    title: "Investment Philosophy",
    copy: "Preserve capital first, compound second. Livie Capital prioritizes liquid assets, disciplined sizing, and asymmetric opportunities with clear exit logic.",
  },
  {
    title: "Markets Covered",
    copy: "US equities, global equities, FX exposure, sovereign cash instruments, private credit themes, and macro hedges across rate and currency cycles.",
  },
  {
    title: "Trading Approach",
    copy: "Blend core allocation with tactical execution. Positions are staged, reviewed against market structure, and managed through predefined stop and profit levels.",
  },
  {
    title: "Risk Philosophy",
    copy: "Risk is budgeted before capital is deployed. Every position must define downside, liquidity, correlation impact, and contribution to total portfolio exposure.",
  },
  {
    title: "Long Term Vision",
    copy: "Build a durable private capital platform that compounds through market regimes while maintaining institutional discipline and founder-level ownership thinking.",
  },
];

export const reports: Report[] = [
  {
    period: "Daily",
    title: "Daily NAV Brief",
    date: "Jun 21, 2026",
    detail: "Intraday P&L, exposures, executions, and risk drift.",
    cadence: "T+0",
  },
  {
    period: "Weekly",
    title: "Weekly Risk Review",
    date: "Week 25",
    detail: "Allocation changes, drawdown control, and market notes.",
    cadence: "Fri",
  },
  {
    period: "Monthly",
    title: "Monthly Investor Letter",
    date: "June 2026",
    detail: "Performance attribution, holdings review, and outlook.",
    cadence: "M+3",
  },
  {
    period: "Annual",
    title: "Annual Fund Report",
    date: "FY 2026",
    detail: "Audited strategy summary, risk metrics, and capital plan.",
    cadence: "YTD",
  },
];
