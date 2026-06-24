import AdminPanel from "@/app/admin/AdminPanel";
import { requireAdmin } from "@/lib/admin/permissions";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Admin tools are protected by Supabase Auth. Keep this page private.
        </section>

        <header className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
            Livie Capital
          </p>
          <div className="mt-4">
            <h1 className="text-3xl font-semibold tracking-normal text-white">
              Admin Tools
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Simple internal forms for portfolio snapshots, positions, trades,
              and reports.
            </p>
          </div>
        </header>

        <AdminPanel />
      </div>
    </main>
  );
}
