import GeneratePdfButton from "@/app/admin/reports/generate/GeneratePdfButton";
import { requireAdmin } from "@/lib/admin/permissions";
import {
  getAssets,
  getPerformanceMetrics,
  getPortfolioSnapshots,
  getTrades,
} from "@/lib/supabase/queries";
import {
  calculateMaximumDrawdown,
  calculateSharpeRatio,
  calculateTotalReturn,
} from "@/lib/performance";
import type { EquityPoint, PerformanceMetric } from "@/types/finance";

type PortfolioSnapshotRow = {
  id: string;
  snapshot_date: string;
  nav: number | string;
  currency: string;
  total_return_percent?: number | string | null;
};

type AssetRow = {
  id: string;
  name: string;
  category: string;
  weight_percent: number | string;
  market_value: number | string;
  currency: string;
};

type TradeRow = {
  id: string;
  executed_at: string;
  symbol: string;
  side: string;
  price: number | string;
  realized_pnl?: number | string | null;
  currency: string;
  status: string;
};

type MetricRow = {
  id: string;
  label: string;
  value: number | string;
  context?: string | null;
  format: PerformanceMetric["format"];
};

type ReadResult<T> = {
  data: T;
  error: string | null;
};

async function safeRead<T>(
  fallback: T,
  reader: () => Promise<T>,
): Promise<ReadResult<T>> {
  try {
    return {
      data: await reader(),
      error: null,
    };
  } catch (error) {
    return {
      data: fallback,
      error: error instanceof Error ? error.message : "Unable to read data.",
    };
  }
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatCurrency(
  value: number | string | null | undefined,
  currency = "USD",
): string {
  return `${currency} ${toNumber(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}

function formatPercent(value: number | string | null | undefined): string {
  return `${toNumber(value).toFixed(2)}%`;
}

function formatRatio(value: number | string | null | undefined): string {
  return toNumber(value).toFixed(2);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getMetric(metrics: MetricRow[], label: string): MetricRow | undefined {
  return metrics.find((metric) =>
    metric.label.toLowerCase().includes(label.toLowerCase()),
  );
}

function getMetricValue(metrics: MetricRow[], label: string): number | null {
  const metric = getMetric(metrics, label);
  return metric ? toNumber(metric.value) : null;
}

function toEquityCurve(snapshots: PortfolioSnapshotRow[]): EquityPoint[] {
  return snapshots
    .slice()
    .reverse()
    .map((snapshot) => ({
      day: snapshot.snapshot_date,
      value: toNumber(snapshot.nav),
    }));
}

function ReportMetric({
  label,
  value,
  context,
}: {
  label: string;
  value: string;
  context: string;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/30 p-4 print:border-zinc-300 print:bg-white">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 font-mono text-2xl text-white print:text-zinc-950">
        {value}
      </p>
      <p className="mt-2 text-xs text-zinc-500 print:text-zinc-600">
        {context}
      </p>
    </article>
  );
}

export default async function GenerateReportPage() {
  await requireAdmin();

  const [snapshotsResult, assetsResult, tradesResult, metricsResult] =
    await Promise.all([
      safeRead<PortfolioSnapshotRow[]>([], () =>
        getPortfolioSnapshots() as Promise<PortfolioSnapshotRow[]>,
      ),
      safeRead<AssetRow[]>([], () => getAssets() as Promise<AssetRow[]>),
      safeRead<TradeRow[]>([], () => getTrades() as Promise<TradeRow[]>),
      safeRead<MetricRow[]>([], () =>
        getPerformanceMetrics() as Promise<MetricRow[]>,
      ),
    ]);

  const snapshots = snapshotsResult.data;
  const latestSnapshot = snapshots.at(0) ?? null;
  const snapshotId = latestSnapshot?.id;
  const assets = snapshotId
    ? assetsResult.data.filter((asset) => "snapshot_id" in asset ? asset.snapshot_id === snapshotId : true)
    : assetsResult.data;
  const recentTrades = tradesResult.data
    .slice()
    .sort(
      (first, second) =>
        new Date(second.executed_at).getTime() -
        new Date(first.executed_at).getTime(),
    )
    .slice(0, 6);
  const equityCurve = toEquityCurve(snapshots);
  const totalReturn =
    getMetricValue(metricsResult.data, "Total Return") ??
    calculateTotalReturn(equityCurve);
  const drawdown =
    getMetricValue(metricsResult.data, "Drawdown") ??
    calculateMaximumDrawdown(equityCurve);
  const winRate = getMetricValue(metricsResult.data, "Win Rate") ?? 0;
  const sharpeRatio =
    getMetricValue(metricsResult.data, "Sharpe Ratio") ??
    calculateSharpeRatio(equityCurve);
  const errors = [
    snapshotsResult.error,
    assetsResult.error,
    tradesResult.error,
    metricsResult.error,
  ].filter((error): error is string => Boolean(error));

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white print:bg-white print:px-0 print:py-0">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 print:max-w-none print:gap-4">
        <header className="rounded-lg border border-white/10 bg-zinc-950/90 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03] print:rounded-none print:border-zinc-300 print:bg-white print:shadow-none print:ring-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300 print:text-zinc-600">
                Livie Capital
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white print:text-zinc-950">
                Portfolio Performance Report
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-400 print:text-zinc-600">
                Institutional report generated from Supabase portfolio data.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <GeneratePdfButton />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                {latestSnapshot
                  ? `As of ${formatDate(latestSnapshot.snapshot_date)}`
                  : "No snapshot date"}
              </p>
            </div>
          </div>
        </header>

        {errors.length > 0 && (
          <section className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-200 print:border-rose-300 print:bg-white print:text-rose-700">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </section>
        )}

        <section className="grid gap-3 md:grid-cols-3 print:grid-cols-3">
          <ReportMetric
            label="Portfolio Value"
            value={
              latestSnapshot
                ? formatCurrency(latestSnapshot.nav, latestSnapshot.currency)
                : "No data"
            }
            context="Latest NAV"
          />
          <ReportMetric
            label="Total Return"
            value={formatPercent(totalReturn)}
            context="Since inception"
          />
          <ReportMetric
            label="Drawdown"
            value={formatPercent(drawdown)}
            context="Peak to trough"
          />
          <ReportMetric
            label="Win Rate"
            value={formatPercent(winRate)}
            context="Closed and reported executions"
          />
          <ReportMetric
            label="Sharpe Ratio"
            value={formatRatio(sharpeRatio)}
            context="Risk adjusted return"
          />
          <ReportMetric
            label="Report Currency"
            value={latestSnapshot?.currency ?? "USD"}
            context="Base reporting currency"
          />
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 print:border-zinc-300 print:bg-white print:shadow-none">
          <div className="border-b border-white/10 pb-4 print:border-zinc-300">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300 print:text-zinc-600">
              Allocation
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white print:text-zinc-950">
              Asset Allocation
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <div
                  key={asset.id}
                  className="grid gap-3 rounded-md border border-white/10 bg-black/20 p-3 text-sm md:grid-cols-[1.4fr_1fr_1fr] print:border-zinc-200 print:bg-white"
                >
                  <div>
                    <p className="font-medium text-white print:text-zinc-950">
                      {asset.name}
                    </p>
                    <p className="text-xs text-zinc-500">{asset.category}</p>
                  </div>
                  <p className="font-mono text-zinc-300 print:text-zinc-700">
                    {formatPercent(asset.weight_percent)}
                  </p>
                  <p className="font-mono text-zinc-300 print:text-zinc-700">
                    {formatCurrency(asset.market_value, asset.currency)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-400 print:text-zinc-600">
                No asset allocation data available.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 print:border-zinc-300 print:bg-white print:shadow-none">
          <div className="border-b border-white/10 pb-4 print:border-zinc-300">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300 print:text-zinc-600">
              Execution
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white print:text-zinc-950">
              Recent Trades
            </h2>
          </div>

          <div className="mt-5 overflow-x-auto">
            {recentTrades.length > 0 ? (
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500 print:border-zinc-300">
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Asset</th>
                    <th className="py-3 pr-4 font-medium">Side</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">P/L</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="border-b border-white/5 print:border-zinc-200"
                    >
                      <td className="py-3 pr-4 text-zinc-300 print:text-zinc-700">
                        {formatDate(trade.executed_at)}
                      </td>
                      <td className="py-3 pr-4 font-mono text-white print:text-zinc-950">
                        {trade.symbol}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 print:text-zinc-700">
                        {trade.side}
                      </td>
                      <td className="py-3 pr-4 font-mono text-zinc-300 print:text-zinc-700">
                        {formatCurrency(trade.price, trade.currency)}
                      </td>
                      <td className="py-3 pr-4 font-mono text-emerald-300 print:text-zinc-700">
                        {trade.realized_pnl === null ||
                        trade.realized_pnl === undefined
                          ? "-"
                          : formatCurrency(trade.realized_pnl, trade.currency)}
                      </td>
                      <td className="py-3 text-zinc-300 print:text-zinc-700">
                        {trade.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-zinc-400 print:text-zinc-600">
                No recent trades available.
              </p>
            )}
          </div>
        </section>

        <footer className="pb-2 text-center text-xs text-zinc-600 print:text-zinc-500">
          Protect. Compound. Grow. | Livie Capital | Confidential Report
        </footer>
      </div>
    </main>
  );
}
