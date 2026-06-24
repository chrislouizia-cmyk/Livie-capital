import Link from "next/link";
import { requireAdmin } from "@/lib/admin/permissions";
import {
  getAssets,
  getLatestPortfolioSnapshot,
  getPerformanceMetrics,
  getPositions,
  getReports,
  getTrades,
} from "@/lib/supabase/queries";

type Row = Record<string, unknown>;

function formatCurrency(value: unknown): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "N/A";
  }

  return `$${numericValue.toLocaleString("en-US")} USD`;
}

function DataPreview({
  title,
  rows,
}: {
  title: string;
  rows: Row[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="font-mono text-xs text-zinc-500">Rows: {rows.length}</p>
      </div>
      <pre className="mt-4 max-h-72 overflow-auto rounded-md bg-black/30 p-3 font-mono text-xs leading-5 text-zinc-300">
        {JSON.stringify(rows.slice(0, 5), null, 2)}
      </pre>
    </section>
  );
}

export default async function AdminPortfolioPage() {
  await requireAdmin();

  const snapshot = await getLatestPortfolioSnapshot();
  const snapshotId = snapshot.id;
  const [assets, positions, trades, reports, performanceMetrics] =
    await Promise.all([
      getAssets(snapshotId),
      getPositions(snapshotId),
      getTrades(snapshotId),
      getReports(snapshotId),
      getPerformanceMetrics(snapshotId),
    ]);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
              Admin Portfolio
            </p>
            <h1 className="mt-3 text-2xl font-semibold">Read-Only Data Review</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Snapshot {snapshot.snapshot_date}
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300"
          >
            Back to Admin
          </Link>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              NAV
            </p>
            <p className="mt-3 font-mono text-2xl text-white">
              {formatCurrency(snapshot.nav)}
            </p>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Daily P&L
            </p>
            <p className="mt-3 font-mono text-2xl text-emerald-300">
              {formatCurrency(snapshot.daily_pnl)}
            </p>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Total Return
            </p>
            <p className="mt-3 font-mono text-2xl text-emerald-300">
              {Number(snapshot.total_return_percent).toFixed(1)}%
            </p>
          </div>
        </section>

        <DataPreview title="Assets" rows={assets} />
        <DataPreview title="Positions" rows={positions} />
        <DataPreview title="Trades" rows={trades} />
        <DataPreview title="Reports" rows={reports} />
        <DataPreview title="Performance Metrics" rows={performanceMetrics} />
      </div>
    </main>
  );
}
