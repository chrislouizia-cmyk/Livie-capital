import { strategySections } from "@/data/portfolio";

export default function InvestmentStrategy() {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Mandate
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Investment Strategy
          </h2>
        </div>
        <div className="rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-zinc-400">
          <span className="text-zinc-600">Horizon</span>
          <span className="ml-3 text-emerald-300">Long Duration</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {strategySections.map((section, index) => (
          <article
            key={section.title}
            className="rounded-md border border-white/[0.08] bg-black/30 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-white">
                {section.title}
              </h3>
              <span className="font-mono text-xs text-zinc-600">
                0{index + 1}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {section.copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
