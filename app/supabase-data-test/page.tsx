import {
  getAssets,
  getPerformanceMetrics,
  getPositions,
  getPortfolioSnapshots,
  getReports,
  SEEDED_SNAPSHOT_ID,
  getTrades,
} from "@/lib/supabase/queries";

type ReadResult = {
  label: string;
  count: number;
  error?: string;
  firstRow?: unknown;
};

async function safeRead(label: string, read: () => Promise<unknown[]>): Promise<ReadResult> {
  try {
    const data = await read();

    return {
      label,
      count: data.length,
      firstRow: data.at(0),
    };
  } catch (error) {
    return {
      label,
      count: 0,
      error: error instanceof Error ? error.message : "Unknown Supabase read error.",
    };
  }
}

export default async function SupabaseDataTestPage() {
  const results = [
    await safeRead("portfolio_snapshots", getPortfolioSnapshots),
    await safeRead("assets", getAssets),
    await safeRead("positions", getPositions),
    await safeRead("trades", getTrades),
    await safeRead("reports", getReports),
    await safeRead("performance_metrics", getPerformanceMetrics),
  ];

  const filteredResults = [
    await safeRead("assets filtered by seeded snapshot", () =>
      getAssets(SEEDED_SNAPSHOT_ID),
    ),
    await safeRead("positions filtered by seeded snapshot", () =>
      getPositions(SEEDED_SNAPSHOT_ID),
    ),
    await safeRead("trades filtered by seeded snapshot", () =>
      getTrades(SEEDED_SNAPSHOT_ID),
    ),
    await safeRead("reports filtered by seeded snapshot", () =>
      getReports(SEEDED_SNAPSHOT_ID),
    ),
    await safeRead("performance_metrics filtered by seeded snapshot", () =>
      getPerformanceMetrics(SEEDED_SNAPSHOT_ID),
    ),
  ];

  const hasErrors = [...results, ...filteredResults].some((result) => result.error);

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto w-full max-w-3xl rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Livie Capital
        </p>
        <h1 className="mt-4 text-2xl font-semibold">
          {hasErrors
            ? "Supabase data reads need attention"
            : "Supabase data reads working"}
        </h1>

        <p className="mt-3 font-mono text-xs text-zinc-500">
          Seeded snapshot ID: {SEEDED_SNAPSHOT_ID}
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Table</th>
                <th className="px-4 py-3 text-right font-medium">Rows</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.label}
                  className="border-t border-white/[0.06]"
                >
                  <td className="px-4 py-4 font-mono text-white">
                    {result.label}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-zinc-300">
                    {result.count}
                  </td>
                  <td className="px-4 py-4">
                    {result.error ? (
                      <span className="text-rose-300">{result.error}</span>
                    ) : (
                      <span className="text-emerald-300">Read successful</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4">
          {[...results, ...filteredResults].map((result) => (
            <div
              key={`${result.label}-preview`}
              className="rounded-lg border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-mono text-sm text-white">{result.label}</h2>
                <p className="font-mono text-xs text-zinc-500">
                  rows: {result.count}
                </p>
              </div>
              {result.error ? (
                <p className="mt-3 text-sm text-rose-300">{result.error}</p>
              ) : (
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-white/[0.03] p-3 font-mono text-xs leading-5 text-zinc-300">
                  {JSON.stringify(result.firstRow ?? null, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
