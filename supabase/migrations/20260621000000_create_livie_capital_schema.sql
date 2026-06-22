create extension if not exists pgcrypto;

create type currency_code as enum ('MXN', 'USD', 'FX');
create type asset_category as enum ('Equity', 'Credit', 'Cash', 'Hedge');
create type asset_region as enum ('US', 'Mexico', 'Global');
create type position_direction as enum ('Long', 'Short');
create type trade_side as enum ('Buy', 'Sell', 'Short', 'Cover', 'Hedge', 'Roll');
create type trade_status as enum ('Filled', 'Live', 'Queued', 'Cancelled');
create type report_period as enum ('Daily', 'Weekly', 'Monthly', 'Annual');
create type performance_metric_format as enum ('percent', 'currency', 'ratio', 'number');

create table portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  nav numeric(20, 4) not null check (nav >= 0),
  currency currency_code not null default 'MXN',
  daily_pnl numeric(20, 4) not null default 0,
  total_return_percent numeric(12, 6) not null default 0,
  risk_reserve_percent numeric(12, 6) not null default 0 check (
    risk_reserve_percent >= 0
    and risk_reserve_percent <= 100
  ),
  deployed_capital_percent numeric(12, 6) not null default 0 check (
    deployed_capital_percent >= 0
    and deployed_capital_percent <= 100
  ),
  gross_exposure numeric(12, 6) not null default 0 check (gross_exposure >= 0),
  net_exposure numeric(12, 6) not null default 0,
  mxn_usd numeric(20, 8) not null check (mxn_usd > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_date)
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references portfolio_snapshots(id) on delete cascade,
  name text not null,
  category asset_category not null,
  region asset_region not null,
  weight_percent numeric(12, 6) not null check (
    weight_percent >= 0
    and weight_percent <= 100
  ),
  market_value numeric(20, 4) not null check (market_value >= 0),
  currency currency_code not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_id, name)
);

create table positions (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references portfolio_snapshots(id) on delete cascade,
  asset text not null,
  direction position_direction not null,
  quantity numeric(24, 8) not null check (quantity > 0),
  entry_price numeric(20, 8) not null check (entry_price > 0),
  current_price numeric(20, 8) not null check (current_price > 0),
  stop_loss numeric(20, 8) check (stop_loss > 0),
  take_profit numeric(20, 8) check (take_profit > 0),
  currency currency_code not null,
  risk_per_trade_percent numeric(12, 6) not null check (
    risk_per_trade_percent >= 0
    and risk_per_trade_percent <= 100
  ),
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (closed_at is null or opened_at is null or closed_at >= opened_at)
);

create table trades (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references portfolio_snapshots(id) on delete set null,
  position_id uuid references positions(id) on delete set null,
  executed_at timestamptz not null,
  symbol text not null,
  side trade_side not null,
  quantity numeric(24, 8) not null check (quantity > 0),
  price numeric(20, 8) not null check (price > 0),
  currency currency_code not null,
  realized_pnl numeric(20, 4),
  status trade_status not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references portfolio_snapshots(id) on delete set null,
  period report_period not null,
  title text not null,
  report_date date not null,
  detail text not null,
  cadence text not null,
  file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table performance_metrics (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references portfolio_snapshots(id) on delete cascade,
  label text not null,
  value numeric(20, 8) not null,
  context text,
  format performance_metric_format not null,
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (snapshot_id, label)
);

create index assets_snapshot_id_idx on assets(snapshot_id);
create index positions_snapshot_id_idx on positions(snapshot_id);
create index positions_asset_idx on positions(asset);
create index trades_snapshot_id_idx on trades(snapshot_id);
create index trades_position_id_idx on trades(position_id);
create index trades_symbol_idx on trades(symbol);
create index trades_executed_at_idx on trades(executed_at desc);
create index reports_snapshot_id_idx on reports(snapshot_id);
create index reports_report_date_idx on reports(report_date desc);
create index performance_metrics_snapshot_id_idx on performance_metrics(snapshot_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_portfolio_snapshots_updated_at
before update on portfolio_snapshots
for each row execute function set_updated_at();

create trigger set_assets_updated_at
before update on assets
for each row execute function set_updated_at();

create trigger set_positions_updated_at
before update on positions
for each row execute function set_updated_at();

create trigger set_trades_updated_at
before update on trades
for each row execute function set_updated_at();

create trigger set_reports_updated_at
before update on reports
for each row execute function set_updated_at();

create trigger set_performance_metrics_updated_at
before update on performance_metrics
for each row execute function set_updated_at();
