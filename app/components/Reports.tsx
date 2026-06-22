import { Download, FileText } from "lucide-react";
import type { ReportRow } from "@/lib/dashboard/data";

function formatReportDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function ReportsLoading() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Reporting
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Investor Reports
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Secure Downloads
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <article
            key={index}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-300">
                <FileText size={17} />
              </div>
              <span className="h-6 w-12 rounded-md border border-emerald-400/20 bg-emerald-400/10" />
            </div>

            <span className="mt-5 block h-3 w-16 rounded bg-white/10" />
            <span className="mt-3 block h-5 w-32 rounded bg-white/10" />
            <span className="mt-3 block h-3 w-24 rounded bg-white/10" />
            <div className="mt-5 space-y-2">
              <span className="block h-3 w-full rounded bg-white/10" />
              <span className="block h-3 w-10/12 rounded bg-white/10" />
            </div>

            <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
              <Download size={15} className="text-zinc-400" />
              <span className="h-3 w-16 rounded bg-white/10" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Reports({
  reports,
  errorMessage,
}: {
  reports: ReportRow[];
  errorMessage?: string | null;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Reporting
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Investor Reports
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Secure Downloads
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {errorMessage && (
          <p className="text-sm leading-6 text-zinc-400">
            Reports are unavailable right now.
          </p>
        )}

        {!errorMessage && reports.length === 0 && (
          <p className="text-sm leading-6 text-zinc-400">
            No reports available.
          </p>
        )}

        {!errorMessage && reports.map((report) => (
          <article
            key={report.id}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-300">
                <FileText size={17} />
              </div>
              <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-mono text-xs text-emerald-300">
                {report.cadence}
              </span>
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-zinc-600">
              {report.period}
            </p>
            <h3 className="mt-2 text-base font-medium text-white">
              {report.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {formatReportDate(report.report_date)}
            </p>
            <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">
              {report.detail}
            </p>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200"
            >
              <Download size={15} />
              Download
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
