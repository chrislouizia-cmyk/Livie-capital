import type { PerformanceMetricRow } from "@/lib/dashboard/data";

const metricWidths: Record<string, string> = {
  "Total Return": "92%",
  Drawdown: "24%",
  "Win Rate": "78%",
  "Sharpe Ratio": "68%",
  "Risk per Trade": "18%",
};

function formatMetricValue(metric: PerformanceMetricRow): string {
  const value = toNumber(metric.value);

  if (metric.format === "ratio") {
    return value.toFixed(2);
  }

  if (metric.format === "percent") {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  }

  if (metric.format === "currency") {
    return `$${value.toLocaleString("en-US")}`;
  }

  return value.toLocaleString("en-US");
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getMetricValue(metrics: PerformanceMetricRow[], label: string): number {
  const metric = metrics.find((item) => item.label === label);
  return toNumber(metric?.value);
}

function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function calculateAlpha(performanceMetrics: PerformanceMetricRow[]): number {
  const totalReturn = getMetricValue(performanceMetrics, "Total Return");
  const riskPerTrade = getMetricValue(performanceMetrics, "Risk per Trade");

  return totalReturn - riskPerTrade;
}

export default function PerformanceHistory({
  performanceMetrics,
  errorMessage,
}: {
  performanceMetrics: PerformanceMetricRow[];
  errorMessage?: string | null;
}) {
  const alpha = calculateAlpha(performanceMetrics);

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Performance History
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Return Profile
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
            <p className="text-zinc-600">Base</p>
            <p className="mt-1 text-white">USD</p>
          </div>
          <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
            <p className="text-emerald-100/60">Alpha</p>
            <p className="mt-1 text-emerald-300">
              {formatSignedPercent(alpha)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {errorMessage && (
          <p className="text-sm leading-6 text-zinc-400">
            Performance history is unavailable right now.
          </p>
        )}

        {!errorMessage && performanceMetrics.length === 0 && (
          <p className="text-sm leading-6 text-zinc-400">
            No performance metrics available.
          </p>
        )}

        {!errorMessage && performanceMetrics.map((item) => (
          <article
            key={item.id}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                {item.label}
              </p>
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>
            <p className="mt-5 font-mono text-3xl text-emerald-300">
              {formatMetricValue(item)}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{item.context}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-300"
                style={{ width: metricWidths[item.label] ?? "50%" }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
