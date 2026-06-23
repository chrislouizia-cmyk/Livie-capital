"use client";

import { useActionState } from "react";
import { addTradeEntry } from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/app/admin/adminTypes";
import type { TradeSide } from "@/types/finance";

const tradeSides: TradeSide[] = ["Buy", "Sell"];

function StatusMessage({ state }: { state: AdminActionState }) {
  if (state.status === "idle") {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200"
          : "rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200"
      }
      aria-live="polite"
    >
      {state.message}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        step={step}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
      />
    </label>
  );
}

export default function TradeEntryForm() {
  const [state, action, pending] = useActionState(
    addTradeEntry,
    initialAdminActionState,
  );

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="executed_at" type="datetime-local" />
        <Field label="Asset" name="symbol" placeholder="QQQ" />

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Buy/Sell
          </span>
          <select
            name="side"
            required
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-300/40"
          >
            {tradeSides.map((side) => (
              <option key={side} value={side}>
                {side}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Entry Price"
          name="entry_price"
          type="number"
          step="0.00000001"
        />
        <Field
          label="Exit Price"
          name="exit_price"
          type="number"
          required={false}
          step="0.00000001"
        />
        <Field
          label="Stop Loss"
          name="stop_loss"
          type="number"
          required={false}
          step="0.00000001"
        />
        <Field
          label="Take Profit"
          name="take_profit"
          type="number"
          required={false}
          step="0.00000001"
        />
        <Field
          label="Profit/Loss"
          name="realized_pnl"
          type="number"
          required={false}
          step="0.0001"
        />

        <label className="block md:col-span-2">
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Notes
          </span>
          <textarea
            name="notes"
            rows={5}
            className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-emerald-300/40"
            placeholder="Execution rationale, setup quality, or risk notes."
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving..." : "Create Trade"}
        </button>
        <StatusMessage state={state} />
      </div>
    </form>
  );
}
