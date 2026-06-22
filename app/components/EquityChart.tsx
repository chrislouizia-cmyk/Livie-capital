"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PortfolioSnapshotRow } from "@/lib/dashboard/data";

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

export default function EquityChart({
  snapshots,
  errorMessage,
}: {
  snapshots: PortfolioSnapshotRow[];
  errorMessage?: string | null;
}) {
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

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={buildChartData(snapshots)}>
          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
