import EquityChartClient from "@/app/components/EquityChartClient";
import type { PortfolioSnapshotRow } from "@/lib/dashboard/data";
import { getPortfolioSnapshots } from "@/lib/supabase/queries";

type EquityChartPoint = {
  day: string;
  value: number;
};

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatChartDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function buildChartData(snapshots: PortfolioSnapshotRow[]): EquityChartPoint[] {
  return snapshots
    .slice()
    .sort(
      (first, second) =>
        new Date(first.snapshot_date).getTime() -
        new Date(second.snapshot_date).getTime(),
    )
    .map((snapshot) => ({
      day: formatChartDate(snapshot.snapshot_date),
      value: toNumber(snapshot.nav),
    }));
}

export function EquityChartLoading() {
  return (
    <div className="flex h-72 w-full items-center justify-center">
      <div className="h-full w-full rounded-md bg-white/[0.03]" />
    </div>
  );
}

export default async function EquityChart() {
  let snapshots: PortfolioSnapshotRow[] = [];
  let errorMessage: string | null = null;

  try {
    snapshots = (await getPortfolioSnapshots()) as PortfolioSnapshotRow[];
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load equity curve.";
  }

  if (errorMessage) {
    return (
      <div className="flex h-72 w-full items-center justify-center text-sm leading-6 text-zinc-400">
        Equity curve is unavailable right now: {errorMessage}
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center text-sm leading-6 text-zinc-400">
        No equity curve data available.
      </div>
    );
  }

  return <EquityChartClient data={buildChartData(snapshots)} />;
}
