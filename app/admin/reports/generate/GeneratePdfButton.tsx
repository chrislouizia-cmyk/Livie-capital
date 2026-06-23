"use client";

export default function GeneratePdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/15 print:hidden"
    >
      Generate PDF
    </button>
  );
}
