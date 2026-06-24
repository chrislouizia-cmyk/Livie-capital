import { signInAdmin } from "@/app/admin/login/actions";
import { createClient } from "@/lib/supabase/server";

type LoginDiagnostics = {
  supabaseUrlLoaded: boolean;
  supabaseAnonKeyLoaded: boolean;
  supabaseClientInitialized: boolean;
  supabaseClientError: string | null;
};

async function getLoginDiagnostics(): Promise<LoginDiagnostics> {
  const supabaseUrlLoaded = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKeyLoaded = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  try {
    await createClient();

    return {
      supabaseUrlLoaded,
      supabaseAnonKeyLoaded,
      supabaseClientInitialized: true,
      supabaseClientError: null,
    };
  } catch (error) {
    return {
      supabaseUrlLoaded,
      supabaseAnonKeyLoaded,
      supabaseClientInitialized: false,
      supabaseClientError:
        error instanceof Error
          ? error.message
          : "Unable to initialize Supabase client.",
    };
  }
}

function StatusLine({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className={ok ? "text-emerald-300" : "text-rose-300"}>
        {ok ? "Loaded" : "Missing"}
      </span>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [{ error, message: authMessage }, diagnostics] = await Promise.all([
    searchParams,
    getLoginDiagnostics(),
  ]);
  const message =
    error === "not-admin"
      ? "This account is not authorized for Livie Capital admin access."
      : error === "auth" && authMessage
        ? authMessage
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
          Livie Capital
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Admin Login</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Sign in with an authorized Supabase account to access admin tools.
        </p>

        {message && (
          <div className="mt-4 rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            <p className="font-medium">Supabase auth error</p>
            <p className="mt-1">{message}</p>
          </div>
        )}

        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs leading-6 text-zinc-400">
          <StatusLine
            label="NEXT_PUBLIC_SUPABASE_URL"
            ok={diagnostics.supabaseUrlLoaded}
          />
          <StatusLine
            label="NEXT_PUBLIC_SUPABASE_ANON_KEY"
            ok={diagnostics.supabaseAnonKeyLoaded}
          />
          <div className="flex items-center justify-between gap-4">
            <span>Supabase client</span>
            <span
              className={
                diagnostics.supabaseClientInitialized
                  ? "text-emerald-300"
                  : "text-rose-300"
              }
            >
              {diagnostics.supabaseClientInitialized
                ? "Initialized"
                : "Failed"}
            </span>
          </div>
          {diagnostics.supabaseClientError && (
            <p className="mt-2 text-rose-300">
              {diagnostics.supabaseClientError}
            </p>
          )}
        </div>

        <form action={signInAdmin} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200"
          >
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
