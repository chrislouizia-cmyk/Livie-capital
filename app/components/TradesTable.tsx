import type { TradeRow } from "@/lib/dashboard/data";

function formatQuantity(quantity: number): string {
  return new Intl.NumberFormat("en-US").format(quantity);
}

function formatPrice(price: number, symbol: string): string {
  if (symbol === "MXN/USD") {
    return price.toFixed(2);
  }

  if (symbol === "CETES") {
    return `${price.toFixed(2)}%`;
  }

  return `$${price.toFixed(2)}`;
}

function formatTradeTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatTradeQuantity(quantity: number, symbol: string): string {
  if (symbol === "MXN/USD" || symbol === "CETES") {
    return `${(quantity * 100).toFixed(0)}%`;
  }

  return formatQuantity(quantity);
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function TradesTableLoading() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Execution
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Trade Blotter
          </h2>
        </div>
        <p className="font-mono text-xs text-zinc-500">T+0</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-zinc-600">
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium">Side</th>
              <th className="pb-3 text-right font-medium">Qty</th>
              <th className="pb-3 text-right font-medium">Price</th>
              <th className="pb-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-white/[0.06] last:border-0"
              >
                {Array.from({ length: 6 }, (_, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cellIndex < 3 ? "py-4" : "py-4 text-right"}
                  >
                    <span className="inline-block h-4 w-16 rounded bg-white/10" />
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

export default function TradesTable({
  trades,
  errorMessage,
}: {
  trades: TradeRow[];
  errorMessage?: string | null;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Execution
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Trade Blotter
          </h2>
        </div>
        <p className="font-mono text-xs text-zinc-500">T+0</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-zinc-600">
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium">Side</th>
              <th className="pb-3 text-right font-medium">Qty</th>
              <th className="pb-3 text-right font-medium">Price</th>
              <th className="pb-3 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {errorMessage && (
              <tr>
                <td colSpan={6} className="py-4 text-sm leading-6 text-zinc-400">
                  Trades are unavailable right now.
                </td>
              </tr>
            )}

            {!errorMessage && trades.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-sm leading-6 text-zinc-400">
                  No trades available.
                </td>
              </tr>
            )}

            {!errorMessage && trades.map((trade) => (
              <tr key={trade.id} className="border-b border-white/[0.06] last:border-0">
                <td className="py-4 font-mono text-xs text-zinc-500">{formatTradeTime(trade.executed_at)}</td>
                <td className="py-4 font-mono text-white">{trade.symbol}</td>
                <td className="py-4 text-zinc-300">{trade.side}</td>
                <td className="py-4 text-right font-mono text-zinc-300">{formatTradeQuantity(toNumber(trade.quantity), trade.symbol)}</td>
                <td className="py-4 text-right font-mono text-zinc-300">{formatPrice(toNumber(trade.price), trade.symbol)}</td>
                <td className="py-4 text-right">
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-zinc-300">
                    {trade.status}
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
