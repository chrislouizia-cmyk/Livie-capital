import { createClient } from "@/lib/supabase/server";

export const SEEDED_SNAPSHOT_ID = "10000000-0000-4000-8000-000000000001";

export async function getLatestPortfolioSnapshot() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPortfolioSnapshots() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getAssets(snapshotId?: string) {
  const supabase = await createClient();
  let query = supabase.from("assets").select("*");

  if (snapshotId) {
    query = query.eq("snapshot_id", snapshotId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function getPositions(snapshotId?: string) {
  const supabase = await createClient();
  let query = supabase.from("positions").select("*");

  if (snapshotId) {
    query = query.eq("snapshot_id", snapshotId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function getTrades(snapshotId?: string) {
  const supabase = await createClient();
  let query = supabase.from("trades").select("*");

  if (snapshotId) {
    query = query.eq("snapshot_id", snapshotId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function getReports(snapshotId?: string) {
  const supabase = await createClient();
  let query = supabase.from("reports").select("*");

  if (snapshotId) {
    query = query.eq("snapshot_id", snapshotId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function getPerformanceMetrics(snapshotId?: string) {
  const supabase = await createClient();
  let query = supabase.from("performance_metrics").select("*");

  if (snapshotId) {
    query = query.eq("snapshot_id", snapshotId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}
