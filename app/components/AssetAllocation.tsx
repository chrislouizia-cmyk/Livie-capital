import type { AssetRow } from "@/lib/dashboard/data";

const assetColorClasses: Record<string, string> = {
  "US Equities": "bg-emerald-400",
  "Mexican Equities": "bg-sky-300",
  "Private Credit": "bg-amber-300",
  "Cash Reserve": "bg-zinc-300",
  "Macro Hedges": "bg-rose-300",
};

function formatCompactCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

function toNumber(value: number | string): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getAssetColorClass(name: string): string {
  return assetColorClasses[name] ?? "bg-zinc-300";
}

function calculateDeployedCapital(assets: AssetRow[]): number {
  const totalMarketValue = assets.reduce(
    (sum, asset) => sum + toNumber(asset.market_value),
    0,
  );
  const cashMarketValue =
    toNumber(
      assets.find((asset) => asset.name === "Cash Reserve")?.market_value ?? 0,
    );

  if (totalMarketValue === 0) {
    return 0;
  }

  return ((totalMarketValue - cashMarketValue) / totalMarketValue) * 100;
}

export function AssetAllocationLoading() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Allocation
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Strategic Book
          </h2>
        </div>
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
          <p className="font-mono text-sm text-emerald-300">--</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/60">
            Deployed
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/10" />
                <span className="h-4 w-32 rounded bg-white/10" />
              </div>
              <span className="h-4 w-20 rounded bg-white/10" />
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AssetAllocation({
  assets,
  errorMessage,
}: {
  assets: AssetRow[];
  errorMessage?: string | null;
}) {
  const deployedCapital = calculateDeployedCapital(assets);

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Allocation
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Strategic Book
          </h2>
        </div>
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
          <p className="font-mono text-sm text-emerald-300">{deployedCapital.toFixed(0)}%</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-100/60">
            Deployed
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {errorMessage && (
          <p className="text-sm leading-6 text-zinc-400">
            Asset allocation is unavailable right now.
          </p>
        )}

        {!errorMessage && assets.length === 0 && (
          <p className="text-sm leading-6 text-zinc-400">
            No asset allocation data available.
          </p>
        )}

        {!errorMessage && assets.map((asset) => {
          const colorClass = getAssetColorClass(asset.name);
          const marketValue = toNumber(asset.market_value);
          const weightPercent = toNumber(asset.weight_percent);
          const safeWidth = Math.min(Math.max(weightPercent, 0), 100);

          return (
          <div key={asset.id}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorClass}`} />
                <span className="truncate text-zinc-200">{asset.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3 font-mono text-xs text-zinc-400">
                <span>{formatCompactCurrency(marketValue)} USD</span>
                <span className="text-white">{weightPercent}%</span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${colorClass}`}
                style={{ width: `${safeWidth}%` }}
              />
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
