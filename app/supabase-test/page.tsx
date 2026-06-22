import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();
  const { error } = await supabase
    .from("portfolio_snapshots")
    .select("id", { count: "exact", head: true });

  const isConnected = !error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/80 p-6 text-center shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          Livie Capital
        </p>
        <h1 className="mt-4 text-2xl font-semibold">
          {isConnected ? "Supabase Connected" : "Supabase Connection Failed"}
        </h1>
        {!isConnected && (
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            {error.message}
          </p>
        )}
      </section>
    </main>
  );
}
