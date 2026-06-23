import {
  getAssets,
  getPerformanceMetrics,
  getPortfolioSnapshots,
  getPositions,
  getReports,
  getTrades,
} from "@/lib/supabase/queries";
import { requireAdmin } from "@/lib/admin/permissions";

type PortfolioSnapshotRow = {
  id: string;
  snapshot_date: string;
  nav: number | string;
  currency: string;
  daily_pnl: number | string;
  total_return_percent: number | string;
  risk_reserve_percent: number | string;
  deployed_capital_percent: number | string;
};

type TradeRow = {
  id: string;
  executed_at: string;
  symbol: string;
  side: string;
  quantity: number | string;
  price: number | string;
  currency: string;
  status: string;
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

function formatCurrency(value: number | string | null | undefined): string {
  return `$${toNumber(value).toLocaleString("en-US")}`;
}

function formatPercent(value: number | string | null | undefined): string {
  return `${toNumber(value).toFixed(1)}%`;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function getLatestTrade(trades: TradeRow[]): TradeRow | null {
  return (
    trades
      .slice()
      .sort(
        (first, second) =>
          new Date(second.executed_at).getTime() -
          new Date(first.executed_at).getTime(),
      )
      .at(0) ?? null
  );
}

function CountCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <p className="mt-4 font-mono text-3xl text-white">{value}</p>
    </article>
  );
}

function DetailCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  await requireAdmin();

  const [
    snapshotsResult,
    assetsResult,
    positionsResult,
    tradesResult,
    reportsResult,
    metricsResult,
  ] = await Promise.all([
    safeRead<PortfolioSnapshotRow[]>([], () =>
      getPortfolioSnapshots() as Promise<PortfolioSnapshotRow[]>,
    ),
    safeRead<unknown[]>([], () => getAssets() as Promise<unknown[]>),
    safeRead<unknown[]>([], () => getPositions() as Promise<unknown[]>),
    safeRead<TradeRow[]>([], () => getTrades() as Promise<TradeRow[]>),
    safeRead<unknown[]>([], () => getReports() as Promise<unknown[]>),
    safeRead<unknown[]>([], () => getPerformanceMetrics() as Promise<unknown[]>),
  ]);

  const latestSnapshot = snapshotsResult.data.at(0) ?? null;
  const latestTrade = getLatestTrade(tradesResult.data);
  const errors = [
    snapshotsResult.error,
    assetsResult.error,
    positionsResult.error,
    tradesResult.error,
    reportsResult.error,
    metricsResult.error,
  ].filter((error): error is string => Boolean(error));

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
            Livie Capital
          </p>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-white">
                Admin Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Read-only operating view for Supabase portfolio data, table
                health, and latest fund activity.
              </p>
            </div>
            <div className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-amber-200">
              Auth pending
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

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <CountCard
            label="Portfolio Snapshot Count"
            value={snapshotsResult.data.length}
          />
          <CountCard label="Assets Count" value={assetsResult.data.length} />
          <CountCard
            label="Positions Count"
            value={positionsResult.data.length}
          />
          <CountCard label="Trades Count" value={tradesResult.data.length} />
          <CountCard label="Reports Count" value={reportsResult.data.length} />
          <CountCard
            label="Performance Metrics Count"
            value={metricsResult.data.length}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <DetailCard eyebrow="Portfolio" title="Latest Portfolio Snapshot">
            {latestSnapshot ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Snapshot Date
                  </p>
                  <p className="mt-2 font-mono text-white">
                    {latestSnapshot.snapshot_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    NAV
                  </p>
                  <p className="mt-2 font-mono text-white">
                    {formatCurrency(latestSnapshot.nav)}{" "}
                    {latestSnapshot.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Daily P&L
                  </p>
                  <p className="mt-2 font-mono text-emerald-300">
                    {formatCurrency(latestSnapshot.daily_pnl)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Total Return
                  </p>
                  <p className="mt-2 font-mono text-emerald-300">
                    {formatPercent(latestSnapshot.total_return_percent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Risk Reserve
                  </p>
                  <p className="mt-2 font-mono text-zinc-300">
                    {formatPercent(latestSnapshot.risk_reserve_percent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Deployed Capital
                  </p>
                  <p className="mt-2 font-mono text-zinc-300">
                    {formatPercent(latestSnapshot.deployed_capital_percent)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-zinc-400">
                No portfolio snapshots available.
              </p>
            )}
          </DetailCard>

          <DetailCard eyebrow="Execution" title="Latest Trade">
            {latestTrade ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Executed At
                  </p>
                  <p className="mt-2 font-mono text-white">
                    {formatDateTime(latestTrade.executed_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Symbol
                  </p>
                  <p className="mt-2 font-mono text-white">
                    {latestTrade.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Side
                  </p>
                  <p className="mt-2 text-zinc-300">{latestTrade.side}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Status
                  </p>
                  <p className="mt-2 font-mono text-emerald-300">
                    {latestTrade.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Quantity
                  </p>
                  <p className="mt-2 font-mono text-zinc-300">
                    {toNumber(latestTrade.quantity).toLocaleString("en-US")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                    Price
                  </p>
                  <p className="mt-2 font-mono text-zinc-300">
                    {formatCurrency(latestTrade.price)} {latestTrade.currency}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-zinc-400">
                No trades available.
              </p>
            )}
          </DetailCard>
        </div>
      </div>
    </main>
  );
}
