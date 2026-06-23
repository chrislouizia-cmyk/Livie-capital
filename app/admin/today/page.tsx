import Link from "next/link";
import { requireAdmin } from "@/lib/admin/permissions";
import {
  getPortfolioSnapshots,
  getPositions,
  getReports,
  getTrades,
} from "@/lib/supabase/queries";

type PortfolioSnapshotRow = {
  id: string;
  snapshot_date: string;
  nav: number | string;
  currency: string;
  daily_pnl: number | string;
};

type PositionRow = {
  id: string;
  asset: string;
  direction: string;
  quantity: number | string;
  entry_price: number | string;
  current_price: number | string;
  risk_per_trade_percent: number | string;
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

type ReportRow = {
  id: string;
  period: string;
  title: string;
  report_date: string;
  detail: string;
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function SummaryCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const valueClass =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
        ? "text-rose-300"
        : "text-white";

  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <p className={`mt-4 font-mono text-2xl ${valueClass}`}>{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </article>
  );
}

export default async function AdminTodayPage() {
  await requireAdmin();

  const snapshotsResult = await safeRead<PortfolioSnapshotRow[]>([], () =>
    getPortfolioSnapshots() as Promise<PortfolioSnapshotRow[]>,
  );
  const latestSnapshot = snapshotsResult.data.at(0) ?? null;
  const snapshotId = latestSnapshot?.id;

  const [positionsResult, tradesResult, reportsResult] = await Promise.all([
    safeRead<PositionRow[]>([], () =>
      snapshotId
        ? (getPositions(snapshotId) as Promise<PositionRow[]>)
        : Promise.resolve([]),
    ),
    safeRead<TradeRow[]>([], () =>
      snapshotId
        ? (getTrades(snapshotId) as Promise<TradeRow[]>)
        : Promise.resolve([]),
    ),
    safeRead<ReportRow[]>([], () =>
      snapshotId
        ? (getReports(snapshotId) as Promise<ReportRow[]>)
        : Promise.resolve([]),
    ),
  ]);

  const recentTrades = tradesResult.data
    .slice()
    .sort(
      (first, second) =>
        new Date(second.executed_at).getTime() -
        new Date(first.executed_at).getTime(),
    )
    .slice(0, 5);
  const recentReports = reportsResult.data
    .slice()
    .sort(
      (first, second) =>
        new Date(second.report_date).getTime() -
        new Date(first.report_date).getTime(),
    )
    .slice(0, 4);
  const todayPnl = toNumber(latestSnapshot?.daily_pnl);
  const errors = [
    snapshotsResult.error,
    positionsResult.error,
    tradesResult.error,
    reportsResult.error,
  ].filter((error): error is string => Boolean(error));

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
            Livie Capital
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-white">
                Today
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Daily portfolio management dashboard for NAV, P&L, open risk,
                trade activity, and reporting flow.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/admin"
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Admin
              </Link>
              <Link
                href="/admin/reports/generate"
                className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/15"
              >
                Generate Report
              </Link>
            </div>
          </div>
        </header>

        {errors.length > 0 && (
          <section className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-200">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </section>
        )}

        <section className="grid gap-3 md:grid-cols-3">
          <SummaryCard
            label="Latest Portfolio Value"
            value={
              latestSnapshot
                ? formatCurrency(latestSnapshot.nav, latestSnapshot.currency)
                : "No data"
            }
            detail={
              latestSnapshot
                ? `Snapshot ${formatDate(latestSnapshot.snapshot_date)}`
                : "Create a portfolio snapshot to begin."
            }
          />
          <SummaryCard
            label="Today's P/L"
            value={
              latestSnapshot
                ? formatCurrency(todayPnl, latestSnapshot.currency)
                : "No data"
            }
            detail="Latest reported daily profit and loss"
            tone={todayPnl >= 0 ? "positive" : "negative"}
          />
          <SummaryCard
            label="Open Positions"
            value={String(positionsResult.data.length)}
            detail="Active positions tied to latest snapshot"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
            <div className="border-b border-white/10 pb-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
                Exposure
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                Open Positions
              </h2>
            </div>

            <div className="mt-5 overflow-x-auto">
              {positionsResult.data.length > 0 ? (
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                      <th className="py-3 pr-4 font-medium">Asset</th>
                      <th className="py-3 pr-4 font-medium">Type</th>
                      <th className="py-3 pr-4 font-medium">Qty</th>
                      <th className="py-3 pr-4 font-medium">Entry</th>
                      <th className="py-3 pr-4 font-medium">Current</th>
                      <th className="py-3 font-medium">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positionsResult.data.map((position) => (
                      <tr
                        key={position.id}
                        className="border-b border-white/5"
                      >
                        <td className="py-3 pr-4 font-mono text-white">
                          {position.asset}
                        </td>
                        <td className="py-3 pr-4 text-zinc-300">
                          {position.direction}
                        </td>
                        <td className="py-3 pr-4 font-mono text-zinc-300">
                          {toNumber(position.quantity).toLocaleString("en-US")}
                        </td>
                        <td className="py-3 pr-4 font-mono text-zinc-300">
                          {formatCurrency(position.entry_price, position.currency)}
                        </td>
                        <td className="py-3 pr-4 font-mono text-zinc-300">
                          {formatCurrency(
                            position.current_price,
                            position.currency,
                          )}
                        </td>
                        <td className="py-3 font-mono text-amber-200">
                          {toNumber(position.risk_per_trade_percent).toFixed(2)}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm leading-6 text-zinc-400">
                  No open positions found for the latest snapshot.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
            <div className="border-b border-white/10 pb-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
                Reporting
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                Recent Reports
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <article
                    key={report.id}
                    className="rounded-md border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{report.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {report.period} | {formatDate(report.report_date)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {report.detail}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-zinc-400">
                  No recent reports found for the latest snapshot.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <div className="border-b border-white/10 pb-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
              Execution
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Recent Trades
            </h2>
          </div>

          <div className="mt-5 overflow-x-auto">
            {recentTrades.length > 0 ? (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-zinc-500">
                    <th className="py-3 pr-4 font-medium">Time</th>
                    <th className="py-3 pr-4 font-medium">Asset</th>
                    <th className="py-3 pr-4 font-medium">Side</th>
                    <th className="py-3 pr-4 font-medium">Price</th>
                    <th className="py-3 pr-4 font-medium">P/L</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-zinc-300">
                        {formatDateTime(trade.executed_at)}
                      </td>
                      <td className="py-3 pr-4 font-mono text-white">
                        {trade.symbol}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">{trade.side}</td>
                      <td className="py-3 pr-4 font-mono text-zinc-300">
                        {formatCurrency(trade.price, trade.currency)}
                      </td>
                      <td className="py-3 pr-4 font-mono text-emerald-300">
                        {trade.realized_pnl === null ||
                        trade.realized_pnl === undefined
                          ? "-"
                          : formatCurrency(trade.realized_pnl, trade.currency)}
                      </td>
                      <td className="py-3 text-zinc-300">{trade.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm leading-6 text-zinc-400">
                No recent trades found for the latest snapshot.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
