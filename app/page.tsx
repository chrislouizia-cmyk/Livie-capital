import { Suspense } from "react";
import AssetAllocation from "@/app/components/AssetAllocation";
import DashboardLayout from "@/app/components/DashboardLayout";
import EquityChart from "@/app/components/EquityChart";
import { EquityChartLoading } from "@/app/components/EquityChart";
import FundMetrics from "@/app/components/FundMetrics";
import { FundMetricsLoading } from "@/app/components/FundMetrics";
import InvestmentStrategy from "@/app/components/InvestmentStrategy";
import OpenPositions from "@/app/components/OpenPositions";
import PerformanceHistory from "@/app/components/PerformanceHistory";
import PortfolioOverview from "@/app/components/PortfolioOverview";
import Reports from "@/app/components/Reports";
import { ReportsLoading } from "@/app/components/Reports";
import TradesTable from "@/app/components/TradesTable";
import { TradesTableLoading } from "@/app/components/TradesTable";
import { marketTape } from "@/data/portfolio";
import { getDashboardData } from "@/lib/dashboard/data";

function formatCompactCurrency(value: number): string {
  return `$${(value / 1000000).toFixed(2)}M`;
}

function formatSignedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function toNumber(value: number | string | null | undefined): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function calculateSnapshotReturn(
  snapshots: { nav: number | string }[],
): number {
  const firstSnapshot = snapshots.at(0);
  const latestSnapshot = snapshots.at(-1);
  const firstValue = toNumber(firstSnapshot?.nav);
  const latestValue = toNumber(latestSnapshot?.nav);

  if (firstValue === 0) {
    return 0;
  }

  return ((latestValue - firstValue) / firstValue) * 100;
}

export default async function Home() {
  const dashboardData = await getDashboardData();
  const latestSnapshot = dashboardData.latestSnapshot;
  const equityCurveReturn = calculateSnapshotReturn(
    dashboardData.portfolioSnapshots,
  );
  const dailyReturn =
    latestSnapshot && toNumber(latestSnapshot.nav) !== 0
      ? (toNumber(latestSnapshot.daily_pnl) / toNumber(latestSnapshot.nav)) *
        100
      : 0;

  const terminalStats = [
    {
      label: "AUM",
      value: formatCompactCurrency(toNumber(latestSnapshot?.nav)),
      tone: "text-white",
    },
    {
      label: "NAV",
      value: formatSignedPercent(dailyReturn),
      tone: "text-emerald-300",
    },
    {
      label: "Base",
      value: latestSnapshot?.currency ?? "USD",
      tone: "text-white",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header
          id="overview"
          className="scroll-mt-6 flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-300">
              Private Capital Terminal
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              LIVIE CAPITAL
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Institutional portfolio command center for liquidity, allocation,
              execution, and risk.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2 font-mono text-xs text-zinc-400">
            {terminalStats.map((stat) => (
              <div key={stat.label} className="rounded-md bg-black/40 px-3 py-2">
                <p className="text-zinc-600">{stat.label}</p>
                <p className={`mt-1 ${stat.tone ?? "text-white"}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/10 pb-4 font-mono text-xs text-zinc-500">
          {marketTape.map((item) => (
            <span key={item.label} className={item.tone}>
              {item.label}
            </span>
          ))}
        </div>

        <PortfolioOverview
          portfolioSnapshot={dashboardData.latestSnapshot}
          performanceMetrics={dashboardData.performanceMetrics}
          errorMessage={
            dashboardData.errors.portfolioSnapshots ??
            dashboardData.errors.performanceMetrics
          }
        />

        <div
          id="portfolio"
          className="scroll-mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]"
        >
          <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                  Performance
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  Equity Curve
                </h2>
              </div>
              <p className="font-mono text-sm text-emerald-300">
                {formatSignedPercent(equityCurveReturn)}
              </p>
            </div>

            <Suspense fallback={<EquityChartLoading />}>
              <EquityChart />
            </Suspense>
          </section>

          <AssetAllocation
            assets={dashboardData.assets}
            errorMessage={dashboardData.errors.assets}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Suspense fallback={<FundMetricsLoading />}>
            <FundMetrics />
          </Suspense>
          <Suspense fallback={<TradesTableLoading />}>
            <TradesTable />
          </Suspense>
        </div>

        <div id="positions" className="scroll-mt-6">
          <OpenPositions
            positions={dashboardData.positions}
            errorMessage={dashboardData.errors.positions}
          />
        </div>

        <div id="performance" className="scroll-mt-6">
          <PerformanceHistory
            performanceMetrics={dashboardData.performanceMetrics}
            errorMessage={dashboardData.errors.performanceMetrics}
          />
        </div>

        <div id="strategy" className="scroll-mt-6">
          <InvestmentStrategy />
        </div>

        <div id="reports" className="scroll-mt-6">
          <Suspense fallback={<ReportsLoading />}>
            <Reports />
          </Suspense>
        </div>

        <footer className="border-t border-white/[0.06] py-6 text-center text-xs leading-6 text-zinc-600">
          <p>Chris Louizia</p>
          <p>chrislouizia@gmail.com</p>
          <p className="mt-2">© 2026 Livie Capital. All rights reserved.</p>
        </footer>
      </div>
    </DashboardLayout>
  );
}
