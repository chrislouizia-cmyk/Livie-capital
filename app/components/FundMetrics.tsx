import type {
  PerformanceMetricRow,
  PortfolioSnapshotRow,
  TradeRow,
} from "@/lib/dashboard/data";

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatRatio(value: number): string {
  return value.toFixed(2);
}

const metricToneClasses: Record<string, string> = {
  "Total Return": "text-emerald-300",
  Drawdown: "text-amber-300",
  "Win Rate": "text-sky-300",
  "Sharpe Ratio": "text-white",
  "Risk per Trade": "text-rose-200",
};

const metricOrder = [
  "Total Return",
  "Drawdown",
  "Win Rate",
  "Sharpe Ratio",
  "Risk per Trade",
];

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatMetricValue(metric: PerformanceMetricRow): string {
  if (metric.format === "ratio") {
    return formatRatio(toNumber(metric.value));
  }

  if (metric.format === "percent") {
    return formatPercent(toNumber(metric.value));
  }

  if (metric.format === "currency") {
    return `$${toNumber(metric.value).toLocaleString("en-US")}`;
  }

  return toNumber(metric.value).toLocaleString("en-US");
}

function buildMetricContext(
  metric: PerformanceMetricRow,
  snapshot: PortfolioSnapshotRow,
  trades: TradeRow[],
): string | null {
  if (metric.label === "Win Rate") {
    const filledTrades = trades.filter((trade) => trade.status === "Filled");
    return `${filledTrades.length} filled trades`;
  }

  if (metric.label === "Total Return") {
    return `Snapshot ${snapshot.snapshot_date}`;
  }

  return metric.context;
}

function buildMetrics(
  snapshot: PortfolioSnapshotRow,
  performanceMetrics: PerformanceMetricRow[],
  trades: TradeRow[],
): PerformanceMetricRow[] {
  const totalReturnMetric = performanceMetrics.find(
    (metric) => metric.label === "Total Return",
  ) ?? {
    id: `${snapshot.id}-total-return`,
    label: "Total Return",
    value: snapshot.total_return_percent,
    context: `Snapshot ${snapshot.snapshot_date}`,
    format: "percent" as const,
  };

  return metricOrder
    .map((label) => {
      const metric =
        label === "Total Return"
          ? totalReturnMetric
          : performanceMetrics.find((item) => item.label === label);

      if (!metric) {
        return null;
      }

      return {
        ...metric,
        context: buildMetricContext(metric, snapshot, trades),
      };
    })
    .filter((metric): metric is PerformanceMetricRow => Boolean(metric));
}

export function FundMetricsLoading() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Fund Metrics
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Risk Dashboard
          </h2>
        </div>
        <p className="font-mono text-xs text-zinc-500">Live NAV</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <span className="block h-3 w-24 rounded bg-white/10" />
            <div className="mt-4 flex items-end justify-between gap-4">
              <span className="block h-8 w-20 rounded bg-white/10" />
              <span className="block h-4 w-24 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FundMetrics({
  portfolioSnapshot,
  performanceMetrics,
  trades,
  errorMessage,
}: {
  portfolioSnapshot: PortfolioSnapshotRow | null;
  performanceMetrics: PerformanceMetricRow[];
  trades: TradeRow[];
  errorMessage?: string | null;
}) {
  const metrics = portfolioSnapshot
    ? buildMetrics(portfolioSnapshot, performanceMetrics, trades)
    : [];

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Fund Metrics
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Risk Dashboard
          </h2>
        </div>
        <p className="font-mono text-xs text-zinc-500">Live NAV</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {errorMessage && (
          <p className="text-sm leading-6 text-zinc-400">
            Fund metrics are unavailable right now.
          </p>
        )}

        {!errorMessage && metrics.length === 0 && (
          <p className="text-sm leading-6 text-zinc-400">
            No fund metrics available.
          </p>
        )}

        {!errorMessage && metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              {metric.label}
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className={`font-mono text-2xl ${metricToneClasses[metric.label] ?? "text-white"}`}>
                {formatMetricValue(metric)}
              </p>
              <p className="text-right text-xs text-zinc-500">
                {metric.context}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
