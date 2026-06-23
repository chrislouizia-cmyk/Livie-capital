alter table portfolio_snapshots
add column if not exists cash_balance numeric(20, 4) check (
  cash_balance is null
  or cash_balance >= 0
),
add column if not exists notes text;
