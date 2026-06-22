alter table portfolio_snapshots enable row level security;
alter table assets enable row level security;
alter table positions enable row level security;
alter table trades enable row level security;
alter table reports enable row level security;
alter table performance_metrics enable row level security;

drop policy if exists "Allow read access to portfolio snapshots" on portfolio_snapshots;
drop policy if exists "Allow read access to assets" on assets;
drop policy if exists "Allow read access to positions" on positions;
drop policy if exists "Allow read access to trades" on trades;
drop policy if exists "Allow read access to reports" on reports;
drop policy if exists "Allow read access to performance metrics" on performance_metrics;

create policy "Allow read access to portfolio snapshots"
on portfolio_snapshots
for select
to anon, authenticated
using (true);

create policy "Allow read access to assets"
on assets
for select
to anon, authenticated
using (true);

create policy "Allow read access to positions"
on positions
for select
to anon, authenticated
using (true);

create policy "Allow read access to trades"
on trades
for select
to anon, authenticated
using (true);

create policy "Allow read access to reports"
on reports
for select
to anon, authenticated
using (true);

create policy "Allow read access to performance metrics"
on performance_metrics
for select
to anon, authenticated
using (true);
