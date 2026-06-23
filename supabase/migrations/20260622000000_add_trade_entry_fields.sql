alter table trades
add column if not exists exit_price numeric(20, 8) check (
  exit_price is null
  or exit_price > 0
),
add column if not exists stop_loss numeric(20, 8) check (
  stop_loss is null
  or stop_loss > 0
),
add column if not exists take_profit numeric(20, 8) check (
  take_profit is null
  or take_profit > 0
),
add column if not exists notes text;
