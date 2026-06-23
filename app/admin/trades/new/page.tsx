import TradeEntryForm from "@/app/admin/trades/new/TradeEntryForm";
import { requireAdmin } from "@/lib/admin/permissions";

export default async function NewTradePage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
            Livie Capital
          </p>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-white">
                Trade Entry
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Create a new execution record for the Livie Capital portfolio.
              </p>
            </div>
            <div className="rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-amber-200">
              No auth yet
            </div>
          </div>
        </header>

        <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
          <div className="border-b border-white/10 pb-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
              Execution
            </p>
            <h2 className="mt-3 text-xl font-semibold text-white">
              New Trade
            </h2>
          </div>

          <div className="mt-6">
            <TradeEntryForm />
          </div>
        </section>
      </div>
    </main>
  );
}
