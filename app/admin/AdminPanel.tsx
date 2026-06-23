"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import {
  addPortfolioSnapshot,
  addPosition,
  addReport,
  addTrade,
} from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/app/admin/adminTypes";

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
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
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
        placeholder={placeholder}
        step={step}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-700"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <select
        name={name}
        required
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <textarea
        name={name}
        required
        rows={4}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
      />
    </label>
  );
}

function SubmitButton({
  pending,
  label,
}: {
  pending: boolean;
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function PanelCard({
  eyebrow,
  title,
  state,
  pending,
  action,
  submitLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  state: AdminActionState;
  pending: boolean;
  action: (payload: FormData) => void;
  submitLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
      <div className="border-b border-white/10 pb-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      </div>

      <form action={action} className="mt-5 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubmitButton pending={pending} label={submitLabel} />
          <StatusMessage state={state} />
        </div>
      </form>
    </section>
  );
}

export default function AdminPanel() {
  const [snapshotState, snapshotAction, snapshotPending] = useActionState(
    addPortfolioSnapshot,
    initialAdminActionState,
  );
  const [positionState, positionAction, positionPending] = useActionState(
    addPosition,
    initialAdminActionState,
  );
  const [tradeState, tradeAction, tradePending] = useActionState(
    addTrade,
    initialAdminActionState,
  );
  const [reportState, reportAction, reportPending] = useActionState(
    addReport,
    initialAdminActionState,
  );

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <PanelCard
        eyebrow="Portfolio"
        title="Add Portfolio Snapshot"
        state={snapshotState}
        pending={snapshotPending}
        action={snapshotAction}
        submitLabel="Add Snapshot"
      >
        <Field label="Snapshot Date" name="snapshot_date" type="date" />
        <Field label="NAV" name="nav" type="number" step="0.0001" />
        <SelectField label="Currency" name="currency">
          <option value="USD">USD</option>
          <option value="FX">FX</option>
        </SelectField>
        <Field label="Daily P&L" name="daily_pnl" type="number" step="0.0001" />
        <Field
          label="Total Return %"
          name="total_return_percent"
          type="number"
          step="0.000001"
        />
        <Field
          label="Risk Reserve %"
          name="risk_reserve_percent"
          type="number"
          step="0.000001"
        />
        <Field
          label="Deployed Capital %"
          name="deployed_capital_percent"
          type="number"
          step="0.000001"
        />
        <Field
          label="Gross Exposure"
          name="gross_exposure"
          type="number"
          step="0.000001"
        />
        <Field
          label="Net Exposure"
          name="net_exposure"
          type="number"
          step="0.000001"
        />
        <Field
          label="USD FX Rate"
          name="mxn_usd"
          type="number"
          step="0.00000001"
        />
      </PanelCard>

      <PanelCard
        eyebrow="Execution"
        title="Add Trade"
        state={tradeState}
        pending={tradePending}
        action={tradeAction}
        submitLabel="Add Trade"
      >
        <Field label="Snapshot ID" name="snapshot_id" required={false} />
        <Field label="Executed At" name="executed_at" type="datetime-local" />
        <Field label="Symbol" name="symbol" placeholder="VTI" />
        <SelectField label="Side" name="side">
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
          <option value="Short">Short</option>
          <option value="Cover">Cover</option>
          <option value="Hedge">Hedge</option>
          <option value="Roll">Roll</option>
        </SelectField>
        <Field label="Quantity" name="quantity" type="number" step="0.00000001" />
        <Field label="Price" name="price" type="number" step="0.00000001" />
        <SelectField label="Currency" name="currency">
          <option value="USD">USD</option>
          <option value="FX">FX</option>
        </SelectField>
        <SelectField label="Status" name="status">
          <option value="Filled">Filled</option>
          <option value="Live">Live</option>
          <option value="Queued">Queued</option>
          <option value="Cancelled">Cancelled</option>
        </SelectField>
        <Field
          label="Realized P&L"
          name="realized_pnl"
          type="number"
          required={false}
          step="0.0001"
        />
      </PanelCard>

      <PanelCard
        eyebrow="Exposure"
        title="Add Position"
        state={positionState}
        pending={positionPending}
        action={positionAction}
        submitLabel="Add Position"
      >
        <Field label="Snapshot ID" name="snapshot_id" required={false} />
        <Field label="Asset" name="asset" placeholder="QQQ" />
        <SelectField label="Long/Short" name="direction">
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </SelectField>
        <Field label="Quantity" name="quantity" type="number" step="0.00000001" />
        <Field
          label="Entry Price"
          name="entry_price"
          type="number"
          step="0.00000001"
        />
        <Field
          label="Current Price"
          name="current_price"
          type="number"
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
        <SelectField label="Currency" name="currency">
          <option value="USD">USD</option>
          <option value="FX">FX</option>
        </SelectField>
        <Field
          label="Risk per Trade %"
          name="risk_per_trade_percent"
          type="number"
          step="0.000001"
        />
        <Field
          label="Opened At"
          name="opened_at"
          type="datetime-local"
          required={false}
        />
      </PanelCard>

      <PanelCard
        eyebrow="Reporting"
        title="Add Report"
        state={reportState}
        pending={reportPending}
        action={reportAction}
        submitLabel="Add Report"
      >
        <Field label="Snapshot ID" name="snapshot_id" required={false} />
        <SelectField label="Period" name="period">
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Annual">Annual</option>
        </SelectField>
        <Field label="Title" name="title" />
        <Field label="Report Date" name="report_date" type="date" />
        <Field label="Cadence" name="cadence" placeholder="T+0" />
        <Field label="File URL" name="file_url" required={false} />
        <TextAreaField label="Detail" name="detail" />
      </PanelCard>
    </div>
  );
}
