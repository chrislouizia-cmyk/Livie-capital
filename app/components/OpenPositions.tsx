import type { PositionRow } from "@/lib/dashboard/data";

function formatPrice(value: number, asset: string): string {
  if (asset === "MXN/USD") {
    return value.toFixed(2);
  }

  return `$${value.toFixed(2)}`;
}

function calculateUnrealizedPnl(position: PositionRow): number {
  const entryPrice = toNumber(position.entry_price);
  const currentPrice = toNumber(position.current_price);

  if (entryPrice === 0) {
    return 0;
  }

  const returnValue =
    position.direction === "Short"
      ? (entryPrice - currentPrice) / entryPrice
      : (currentPrice - entryPrice) / entryPrice;

  return returnValue * 100;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function calculateExposureSummary(positions: PositionRow[]) {
  const gross = positions.reduce((sum, position) => {
    return sum + Math.abs(toNumber(position.quantity) * toNumber(position.current_price));
  }, 0);
  const net = positions.reduce((sum, position) => {
    const directionMultiplier = position.direction === "Short" ? -1 : 1;

    return (
      sum +
      directionMultiplier *
        toNumber(position.quantity) *
        toNumber(position.current_price)
    );
  }, 0);

  if (gross === 0) {
    return { gross: 0, net: 0 };
  }

  const netExposure = Math.abs(net / gross);

  return {
    gross: net === 0 ? 0 : gross / Math.abs(net),
    net: netExposure,
  };
}

export function OpenPositionsLoading() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Exposure
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Open Positions
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
            <p className="text-zinc-600">Gross</p>
            <p className="mt-1 text-white">--</p>
          </div>
          <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
            <p className="text-emerald-100/60">Net</p>
            <p className="mt-1 text-emerald-300">--</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-zinc-600">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Long/Short</th>
              <th className="pb-3 text-right font-medium">Entry Price</th>
              <th className="pb-3 text-right font-medium">Current Price</th>
              <th className="pb-3 text-right font-medium">Stop Loss</th>
              <th className="pb-3 text-right font-medium">Take Profit</th>
              <th className="pb-3 text-right font-medium">Unrealized P/L</th>
              <th className="pb-3 text-right font-medium">Risk per Trade</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-white/[0.06] last:border-0"
              >
                {Array.from({ length: 8 }, (_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cellIndex < 2
                        ? "py-4"
                        : "py-4 text-right"
                    }
                  >
                    <span className="inline-block h-4 w-20 rounded bg-white/10" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function OpenPositions({
  positions,
  errorMessage,
}: {
  positions: PositionRow[];
  errorMessage?: string | null;
}) {
  const exposureSummary = calculateExposureSummary(positions);

  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Exposure
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Open Positions
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2">
            <p className="text-zinc-600">Gross</p>
            <p className="mt-1 text-white">{exposureSummary.gross.toFixed(2)}x</p>
          </div>
          <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2">
            <p className="text-emerald-100/60">Net</p>
            <p className="mt-1 text-emerald-300">{exposureSummary.net.toFixed(2)}x</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-zinc-600">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Long/Short</th>
              <th className="pb-3 text-right font-medium">Entry Price</th>
              <th className="pb-3 text-right font-medium">Current Price</th>
              <th className="pb-3 text-right font-medium">Stop Loss</th>
              <th className="pb-3 text-right font-medium">Take Profit</th>
              <th className="pb-3 text-right font-medium">Unrealized P/L</th>
              <th className="pb-3 text-right font-medium">Risk per Trade</th>
            </tr>
          </thead>
          <tbody>
            {errorMessage && (
              <tr>
                <td colSpan={8} className="py-4 text-sm leading-6 text-zinc-400">
                  Open positions are unavailable right now.
                </td>
              </tr>
            )}

            {!errorMessage && positions.length === 0 && (
              <tr>
                <td colSpan={8} className="py-4 text-sm leading-6 text-zinc-400">
                  No open positions available.
                </td>
              </tr>
            )}

            {!errorMessage && positions.map((position) => (
              <tr
                key={position.id}
                className="border-b border-white/[0.06] last:border-0"
              >
                <td className="py-4 font-mono text-white">{position.asset}</td>
                <td className="py-4">
                  <span
                    className={
                      position.direction === "Long"
                        ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-mono text-xs text-emerald-300"
                        : "rounded-md border border-rose-400/20 bg-rose-400/10 px-2 py-1 font-mono text-xs text-rose-300"
                    }
                  >
                    {position.direction}
                  </span>
                </td>
                <td className="py-4 text-right font-mono text-zinc-400">
                  {formatPrice(toNumber(position.entry_price), position.asset)}
                </td>
                <td className="py-4 text-right font-mono text-zinc-200">
                  {formatPrice(toNumber(position.current_price), position.asset)}
                </td>
                <td className="py-4 text-right font-mono text-rose-200">
                  {formatPrice(toNumber(position.stop_loss), position.asset)}
                </td>
                <td className="py-4 text-right font-mono text-emerald-200">
                  {formatPrice(toNumber(position.take_profit), position.asset)}
                </td>
                <td
                  className={
                    calculateUnrealizedPnl(position) >= 0
                      ? "py-4 text-right font-mono text-emerald-300"
                      : "py-4 text-right font-mono text-rose-300"
                  }
                >
                  {formatPercent(calculateUnrealizedPnl(position))}
                </td>
                <td className="py-4 text-right">
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-zinc-300">
                    {toNumber(position.risk_per_trade_percent).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
