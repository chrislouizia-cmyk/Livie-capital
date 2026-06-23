"use server";

import { revalidatePath } from "next/cache";
import type { AdminActionState } from "@/app/admin/adminTypes";
import { requireAdmin } from "@/lib/admin/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CurrencyCode, TradeSide } from "@/types/finance";

function getString(formData: FormData, key: string): string {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function getOptionalString(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function getNumber(formData: FormData, key: string): number {
  const value = Number(formData.get(key));

  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a valid number.`);
  }

  return value;
}

function getNonNegativeNumber(formData: FormData, key: string): number {
  const value = getNumber(formData, key);

  if (value < 0) {
    throw new Error(`${key} cannot be negative.`);
  }

  return value;
}

function getOptionalNumber(formData: FormData, key: string): number | null {
  const rawValue = String(formData.get(key) ?? "").trim();

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a valid number.`);
  }

  return value;
}

async function getSnapshotId(formData: FormData): Promise<string | null> {
  const explicitSnapshotId = getOptionalString(formData, "snapshot_id");

  if (explicitSnapshotId) {
    return explicitSnapshotId;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("portfolio_snapshots")
    .select("id")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.id ?? null;
}

function getDateTime(formData: FormData, key: string): string {
  const value = getString(formData, key);
  return new Date(value).toISOString();
}

function revalidateAdminData() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/trades/new");
}

function getErrorState(error: unknown): AdminActionState {
  return {
    status: "error",
    message: error instanceof Error ? error.message : "Unable to save data.",
  };
}

export async function addPortfolioSnapshot(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const supabase = createAdminClient();
    const { error } = await supabase.from("portfolio_snapshots").insert({
      snapshot_date: getString(formData, "snapshot_date"),
      nav: getNumber(formData, "nav"),
      currency: getString(formData, "currency"),
      daily_pnl: getNumber(formData, "daily_pnl"),
      total_return_percent: getNumber(formData, "total_return_percent"),
      risk_reserve_percent: getNumber(formData, "risk_reserve_percent"),
      deployed_capital_percent: getNumber(formData, "deployed_capital_percent"),
      gross_exposure: getNumber(formData, "gross_exposure"),
      net_exposure: getNumber(formData, "net_exposure"),
      mxn_usd: getNumber(formData, "mxn_usd"),
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Portfolio snapshot added.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}

export async function addPortfolioSnapshotEntry(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const portfolioValue = getNonNegativeNumber(formData, "portfolio_value");
    const cashBalance = getNonNegativeNumber(formData, "cash_balance");
    const currency: CurrencyCode = "USD";
    const supabase = createAdminClient();
    const { error } = await supabase.from("portfolio_snapshots").insert({
      snapshot_date: getString(formData, "snapshot_date"),
      nav: portfolioValue,
      cash_balance: cashBalance,
      notes: getOptionalString(formData, "notes"),
      currency,
      daily_pnl: 0,
      total_return_percent: 0,
      risk_reserve_percent:
        portfolioValue > 0 ? (cashBalance / portfolioValue) * 100 : 0,
      deployed_capital_percent:
        portfolioValue > 0
          ? ((portfolioValue - cashBalance) / portfolioValue) * 100
          : 0,
      gross_exposure: 0,
      net_exposure: 0,
      mxn_usd: 1,
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Portfolio snapshot created.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}

export async function addPosition(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const snapshotId = await getSnapshotId(formData);

    if (!snapshotId) {
      throw new Error("Create a portfolio snapshot before adding positions.");
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("positions").insert({
      snapshot_id: snapshotId,
      asset: getString(formData, "asset"),
      direction: getString(formData, "direction"),
      quantity: getNumber(formData, "quantity"),
      entry_price: getNumber(formData, "entry_price"),
      current_price: getNumber(formData, "current_price"),
      stop_loss: getOptionalNumber(formData, "stop_loss"),
      take_profit: getOptionalNumber(formData, "take_profit"),
      currency: getString(formData, "currency"),
      risk_per_trade_percent: getNumber(formData, "risk_per_trade_percent"),
      opened_at: getOptionalString(formData, "opened_at")
        ? getDateTime(formData, "opened_at")
        : null,
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Position added.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}

export async function addTrade(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const snapshotId = await getSnapshotId(formData);
    const supabase = createAdminClient();
    const { error } = await supabase.from("trades").insert({
      snapshot_id: snapshotId,
      executed_at: getDateTime(formData, "executed_at"),
      symbol: getString(formData, "symbol"),
      side: getString(formData, "side"),
      quantity: getNumber(formData, "quantity"),
      price: getNumber(formData, "price"),
      currency: getString(formData, "currency"),
      realized_pnl: getOptionalNumber(formData, "realized_pnl"),
      status: getString(formData, "status"),
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Trade added.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}

export async function addTradeEntry(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const snapshotId = await getSnapshotId(formData);
    const side = getString(formData, "side") as TradeSide;
    const supabase = createAdminClient();
    const { error } = await supabase.from("trades").insert({
      snapshot_id: snapshotId,
      executed_at: getDateTime(formData, "executed_at"),
      symbol: getString(formData, "symbol"),
      side,
      quantity: 1,
      price: getNumber(formData, "entry_price"),
      exit_price: getOptionalNumber(formData, "exit_price"),
      stop_loss: getOptionalNumber(formData, "stop_loss"),
      take_profit: getOptionalNumber(formData, "take_profit"),
      currency: "USD",
      realized_pnl: getOptionalNumber(formData, "realized_pnl"),
      status: "Filled",
      notes: getOptionalString(formData, "notes"),
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Trade entry created.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}

export async function addReport(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdmin();

    const snapshotId = await getSnapshotId(formData);
    const supabase = createAdminClient();
    const { error } = await supabase.from("reports").insert({
      snapshot_id: snapshotId,
      period: getString(formData, "period"),
      title: getString(formData, "title"),
      report_date: getString(formData, "report_date"),
      detail: getString(formData, "detail"),
      cadence: getString(formData, "cadence"),
      file_url: getOptionalString(formData, "file_url"),
    });

    if (error) {
      throw error;
    }

    revalidateAdminData();

    return {
      status: "success",
      message: "Report added.",
    };
  } catch (error) {
    return getErrorState(error);
  }
}
