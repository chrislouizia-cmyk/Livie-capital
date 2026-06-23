import { ArrowDownRight, ArrowUpRight, Landmark, ShieldCheck } from "lucide-react";
import type {
  PerformanceMetricRow,
  PortfolioSnapshotRow,
} from "@/lib/dashboard/data";

type PortfolioMetric = {
  label: string;
  value: string;
  detail: string;
  trend: string;
  positive: boolean;
};

function formatCompactCurrency(value: number): string {
  return `$${(value / 1000000).toFixed(2)}M USD`;
}

function formatSignedCompactCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "-";

  return `${sign}$${(Math.abs(value) / 1000).toFixed(0)}K USD`;
}

function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getMetricValue(
  metrics: PerformanceMetricRow[],
  label: string,
  fallback = 0,
): number {
  const metric = metrics.find((item) => item.label === label);
  return metric ? toNumber(metric.value) : fallback;
}

function calculateDailyReturn(snapshot: PortfolioSnapshotRow): number {
  const nav = toNumber(snapshot.nav);

  if (nav === 0) {
    return 0;
  }

  return (toNumber(snapshot.daily_pnl) / nav) * 100;
}

function buildPortfolioMetrics(
  snapshot: PortfolioSnapshotRow,
  performanceMetrics: PerformanceMetricRow[],
): PortfolioMetric[] {
  const dailyReturn = calculateDailyReturn(snapshot);
  const totalReturn = getMetricValue(
    performanceMetrics,
    "Total Return",
    toNumber(snapshot.total_return_percent),
  );
  const drawdown = getMetricValue(performanceMetrics, "Drawdown");

  return [
    {
      label: "Net Asset Value",
      value: formatCompactCurrency(toNumber(snapshot.nav)),
      detail: "Liquid capital base",
      trend: formatSignedPercent(dailyReturn),
      positive: dailyReturn >= 0,
    },
    {
      label: "Total Return",
      value: formatSignedPercent(totalReturn),
      detail: "Since inception",
      trend: `${formatPercent(Math.abs(drawdown))} DD`,
      positive: totalReturn >= 0,
    },
    {
      label: "Daily P&L",
      value: formatSignedCompactCurrency(toNumber(snapshot.daily_pnl)),
      detail: "Marked to market",
      trend: formatSignedPercent(dailyReturn),
      positive: toNumber(snapshot.daily_pnl) >= 0,
    },
    {
      label: "Risk Reserve",
      value: formatPercent(toNumber(snapshot.risk_reserve_percent)),
      detail: "Cash and hedges",
      trend: `${toNumber(snapshot.deployed_capital_percent).toFixed(0)}% deployed`,
      positive: false,
    },
  ];
}

export function PortfolioOverviewLoading() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <article
          key={index}
          className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="h-3 w-32 rounded bg-white/10" />
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]" />
          </div>

          <div className="mt-7 flex items-end justify-between gap-3">
            <div>
              <span className="block h-8 w-28 rounded bg-white/10" />
              <span className="mt-3 block h-4 w-24 rounded bg-white/10" />
            </div>
            <span className="h-5 w-16 rounded bg-white/10" />
          </div>
        </article>
      ))}
    </section>
  );
}

export default function PortfolioOverview({
  portfolioSnapshot,
  performanceMetrics,
  errorMessage,
}: {
  portfolioSnapshot: PortfolioSnapshotRow | null;
  performanceMetrics: PerformanceMetricRow[];
  errorMessage?: string | null;
}) {
  if (errorMessage || !portfolioSnapshot) {
    return (
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <p className="text-sm leading-6 text-zinc-400">
            Portfolio overview is unavailable right now.
          </p>
        </article>
      </section>
    );
  }

  const portfolioMetrics = buildPortfolioMetrics(
    portfolioSnapshot,
    performanceMetrics,
  );

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {portfolioMetrics.map((metric, index) => {
        const TrendIcon = metric.positive ? ArrowUpRight : ArrowDownRight;

        return (
          <article
            key={metric.label}
            className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                {metric.label}
              </p>
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-300">
                {index === 0 ? (
                  <Landmark size={16} />
                ) : index === 3 ? (
                  <ShieldCheck size={16} />
                ) : (
                  <TrendIcon size={16} />
                )}
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-mono text-2xl text-white md:text-3xl">
                  {metric.value}
                </h2>
                <p className="mt-2 text-sm text-zinc-500">{metric.detail}</p>
              </div>
              <div
                className={
                  metric.positive
                    ? "flex items-center gap-1 font-mono text-sm text-emerald-400"
                    : "flex items-center gap-1 font-mono text-sm text-amber-300"
                }
              >
                <TrendIcon size={15} />
                {metric.trend}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
