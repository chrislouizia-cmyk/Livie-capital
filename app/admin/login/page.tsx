import { signInAdmin } from "@/app/admin/login/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    error === "not-admin"
      ? "This account is not authorized for Livie Capital admin access."
      : error === "invalid-login"
        ? "Invalid admin credentials."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
          Livie Capital
        </p>
        <h1 className="mt-4 text-2xl font-semibold">Admin Access</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Sign in with an authorized admin account.
        </p>

        {message && (
          <p className="mt-4 rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            {message}
          </p>
        )}

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
