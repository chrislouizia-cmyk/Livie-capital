import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Layers,
  LineChart,
  Target,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "#overview", icon: BarChart3 },
  { label: "Portfolio", href: "#portfolio", icon: BriefcaseBusiness },
  { label: "Performance", href: "#performance", icon: LineChart },
  { label: "Positions", href: "#positions", icon: Layers },
  { label: "Strategy", href: "#strategy", icon: Target },
  { label: "Reports", href: "#reports", icon: FileText },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-zinc-950/95 px-5 py-6 lg:flex lg:flex-col">
          <div className="border-b border-white/10 pb-6">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-emerald-300">
              Livie Capital
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Command
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Private capital operating terminal.
            </p>
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    index === 0
                      ? "flex items-center gap-3 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-3 text-sm text-emerald-200"
                      : "flex items-center gap-3 rounded-md border border-transparent px-3 py-3 text-sm text-zinc-400 transition hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  }
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
              Session
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
              <div>
                <p className="text-zinc-600">Desk</p>
                <p className="mt-1 text-white">MX/US</p>
              </div>
              <div>
                <p className="text-zinc-600">Status</p>
                <p className="mt-1 text-emerald-300">Live</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-white/10 bg-zinc-950/90 px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-emerald-300">
                  Livie Capital
                </p>
                <p className="mt-1 text-sm text-zinc-400">Command Terminal</p>
              </div>
              <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 font-mono text-xs text-emerald-300">
                Live
              </div>
            </div>
            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
