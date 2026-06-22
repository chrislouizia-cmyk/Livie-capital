import { createClient } from "@/lib/supabase/server";

export type PortfolioSnapshotRow = {
  id: string;
  snapshot_date: string;
  nav: number | string;
  currency: string;
  daily_pnl: number | string;
  total_return_percent: number | string;
  risk_reserve_percent: number | string;
  deployed_capital_percent: number | string;
  gross_exposure: number | string;
  net_exposure: number | string;
  mxn_usd: number | string;
};

export type AssetRow = {
  id: string;
  name: string;
  weight_percent: number | string;
  market_value: number | string;
  currency: string;
};

export type PositionRow = {
  id: string;
  asset: string;
  direction: "Long" | "Short";
  quantity: number | string;
  entry_price: number | string;
  current_price: number | string;
  stop_loss: number | string;
  take_profit: number | string;
  risk_per_trade_percent: number | string;
};

export type TradeRow = {
  id: string;
  executed_at: string;
  symbol: string;
  side: string;
  quantity: number | string;
  price: number | string;
  status: string;
};

export type ReportRow = {
  id: string;
  period: string;
  title: string;
  report_date: string;
  detail: string;
  cadence: string;
};

export type PerformanceMetricRow = {
  id: string;
  label: string;
  value: number | string;
  context: string | null;
  format: "percent" | "currency" | "ratio" | "number";
};

type DashboardErrors = Partial<
  Record<
    | "portfolioSnapshots"
    | "assets"
    | "positions"
    | "trades"
    | "reports"
    | "performanceMetrics",
    string
  >
>;

export type DashboardData = {
  portfolioSnapshots: PortfolioSnapshotRow[];
  latestSnapshot: PortfolioSnapshotRow | null;
  assets: AssetRow[];
  positions: PositionRow[];
  trades: TradeRow[];
  reports: ReportRow[];
  performanceMetrics: PerformanceMetricRow[];
  errors: DashboardErrors;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const errors: DashboardErrors = {};

  const snapshotsResult = await supabase
    .from("portfolio_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: true });

  if (snapshotsResult.error) {
    errors.portfolioSnapshots = snapshotsResult.error.message;
  }

  const portfolioSnapshots =
    (snapshotsResult.data ?? []) as PortfolioSnapshotRow[];
  const latestSnapshot = portfolioSnapshots.at(-1) ?? null;

  if (!latestSnapshot) {
    return {
      portfolioSnapshots,
      latestSnapshot,
      assets: [],
      positions: [],
      trades: [],
      reports: [],
      performanceMetrics: [],
      errors,
    };
  }

  const snapshotId = latestSnapshot.id;
  const [assetsResult, positionsResult, tradesResult, reportsResult, metricsResult] =
    await Promise.all([
      supabase.from("assets").select("*").eq("snapshot_id", snapshotId),
      supabase.from("positions").select("*").eq("snapshot_id", snapshotId),
      supabase.from("trades").select("*").eq("snapshot_id", snapshotId),
      supabase.from("reports").select("*").eq("snapshot_id", snapshotId),
      supabase
        .from("performance_metrics")
        .select("*")
        .eq("snapshot_id", snapshotId),
    ]);

  if (assetsResult.error) {
    errors.assets = getErrorMessage(
      assetsResult.error,
      "Unable to load assets.",
    );
  }

  if (positionsResult.error) {
    errors.positions = getErrorMessage(
      positionsResult.error,
      "Unable to load positions.",
    );
  }

  if (tradesResult.error) {
    errors.trades = getErrorMessage(
      tradesResult.error,
      "Unable to load trades.",
    );
  }

  if (reportsResult.error) {
    errors.reports = getErrorMessage(
      reportsResult.error,
      "Unable to load reports.",
    );
  }

  if (metricsResult.error) {
    errors.performanceMetrics = getErrorMessage(
      metricsResult.error,
      "Unable to load performance metrics.",
    );
  }

  return {
    portfolioSnapshots,
    latestSnapshot,
    assets: (assetsResult.data ?? []) as AssetRow[],
    positions: (positionsResult.data ?? []) as PositionRow[],
    trades: (tradesResult.data ?? []) as TradeRow[],
    reports: (reportsResult.data ?? []) as ReportRow[],
    performanceMetrics: (metricsResult.data ?? []) as PerformanceMetricRow[],
    errors,
  };
}
