import Link from "next/link";
import { requireAdmin } from "@/lib/admin/permissions";
import { getLatestPortfolioSnapshot } from "@/lib/supabase/queries";
import { signOutAdmin } from "@/app/admin/login/actions";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export default async function AdminPage() {
  const user = await requireAdmin();
  const snapshot = await getLatestPortfolioSnapshot();

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <section className="mx-auto w-full max-w-5xl rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
              Admin
            </p>
            <h1 className="mt-3 text-2xl font-semibold">Livie Capital Control</h1>
            <p className="mt-2 text-sm text-zinc-500">{user.email}</p>
          </div>
          <form action={signOutAdmin}>
            <button
              type="submit"
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Latest NAV
            </p>
            <p className="mt-3 font-mono text-2xl text-white">
              {formatCurrency(Number(snapshot.nav))} {snapshot.currency}
            </p>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Snapshot Date
            </p>
            <p className="mt-3 font-mono text-2xl text-white">
              {snapshot.snapshot_date}
            </p>
          </div>
          <div className="rounded-md border border-white/[0.08] bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Access
            </p>
            <p className="mt-3 font-mono text-2xl text-emerald-300">
              Read Only
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/admin/portfolio"
            className="inline-flex rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200"
          >
            View Portfolio Data
          </Link>
        </div>
      </section>
    </main>
  );
}
