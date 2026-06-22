begin;

-- =========================================================
-- Livie Capital seed constants
-- =========================================================
-- This seed uses explicit UUIDs so related rows can reference
-- the same portfolio snapshot and positions every time it runs.

-- =========================================================
-- Cleanup existing sample data for the same snapshot date
-- =========================================================
delete from trades
where snapshot_id in (
  select id from portfolio_snapshots
  where snapshot_date = date '2026-06-21'
);

delete from reports
where snapshot_id in (
  select id from portfolio_snapshots
  where snapshot_date = date '2026-06-21'
);

delete from performance_metrics
where snapshot_id in (
  select id from portfolio_snapshots
  where snapshot_date = date '2026-06-21'
);

delete from positions
where snapshot_id in (
  select id from portfolio_snapshots
  where snapshot_date = date '2026-06-21'
);

delete from assets
where snapshot_id in (
  select id from portfolio_snapshots
  where snapshot_date = date '2026-06-21'
);

delete from portfolio_snapshots
where snapshot_date = date '2026-06-21';

-- =========================================================
-- portfolio_snapshots
-- =========================================================
insert into portfolio_snapshots (
  id,
  snapshot_date,
  nav,
  currency,
  daily_pnl,
  total_return_percent,
  risk_reserve_percent,
  deployed_capital_percent,
  gross_exposure,
  net_exposure,
  mxn_usd
)
values (
  '10000000-0000-4000-8000-000000000001',
  date '2026-06-21',
  12480000,
  'MXN',
  299000,
  24.8,
  18,
  82,
  1.18,
  0.82,
  18.44
)
on conflict (id) do nothing;

-- =========================================================
-- assets
-- =========================================================
insert into assets (
  id,
  snapshot_id,
  name,
  category,
  region,
  weight_percent,
  market_value,
  currency
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'US Equities',
    'Equity',
    'US',
    34,
    4240000,
    'MXN'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'Mexican Equities',
    'Equity',
    'Mexico',
    22,
    2750000,
    'MXN'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    'Private Credit',
    'Credit',
    'Global',
    18,
    2250000,
    'MXN'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000001',
    'Cash Reserve',
    'Cash',
    'Mexico',
    16,
    2000000,
    'MXN'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000001',
    'Macro Hedges',
    'Hedge',
    'Global',
    10,
    1240000,
    'MXN'
  )
on conflict (id) do nothing;

-- =========================================================
-- positions
-- =========================================================
-- The current schema stores the position instrument in positions.asset.
-- The names below align with dashboard instruments and trades.
insert into positions (
  id,
  snapshot_id,
  asset,
  direction,
  quantity,
  entry_price,
  current_price,
  stop_loss,
  take_profit,
  currency,
  risk_per_trade_percent,
  opened_at
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'VTI',
    'Long',
    2100,
    296.40,
    304.18,
    287.50,
    318.00,
    'USD',
    0.36,
    '2026-05-06T14:30:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'NAFTRAC',
    'Long',
    38500,
    55.90,
    57.42,
    53.80,
    61.00,
    'MXN',
    0.42,
    '2026-05-14T15:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    'MXN/USD',
    'Short',
    0.20,
    18.51,
    18.44,
    18.72,
    18.10,
    'FX',
    0.18,
    '2026-06-03T16:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000001',
    'QQQ',
    'Long',
    900,
    467.25,
    463.80,
    452.00,
    492.00,
    'USD',
    0.55,
    '2026-06-12T14:45:00Z'
  )
on conflict (id) do nothing;

-- =========================================================
-- trades
-- =========================================================
insert into trades (
  id,
  snapshot_id,
  position_id,
  executed_at,
  symbol,
  side,
  quantity,
  price,
  currency,
  realized_pnl,
  status
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '2026-06-21T09:32:00Z',
    'VTI',
    'Buy',
    2100,
    304.18,
    'USD',
    null,
    'Filled'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000002',
    '2026-06-21T10:11:00Z',
    'NAFTRAC',
    'Buy',
    38500,
    57.42,
    'MXN',
    null,
    'Filled'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000003',
    '2026-06-21T11:46:00Z',
    'MXN/USD',
    'Hedge',
    0.20,
    18.44,
    'FX',
    null,
    'Live'
  ),
  (
    '40000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000001',
    null,
    '2026-06-21T13:08:00Z',
    'CETES',
    'Roll',
    0.16,
    10.91,
    'MXN',
    null,
    'Queued'
  )
on conflict (id) do nothing;

-- =========================================================
-- reports
-- =========================================================
insert into reports (
  id,
  snapshot_id,
  period,
  title,
  report_date,
  detail,
  cadence,
  file_url
)
values
  (
    '50000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Daily',
    'Daily NAV Brief',
    date '2026-06-21',
    'Intraday P&L, exposures, executions, and risk drift.',
    'T+0',
    null
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'Weekly',
    'Weekly Risk Review',
    date '2026-06-19',
    'Allocation changes, drawdown control, and market notes.',
    'Fri',
    null
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    'Monthly',
    'Monthly Investor Letter',
    date '2026-06-30',
    'Performance attribution, holdings review, and outlook.',
    'M+3',
    null
  ),
  (
    '50000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000001',
    'Annual',
    'Annual Fund Report',
    date '2026-12-31',
    'Audited strategy summary, risk metrics, and capital plan.',
    'YTD',
    null
  )
on conflict (id) do nothing;

-- =========================================================
-- performance_metrics
-- =========================================================
insert into performance_metrics (
  id,
  snapshot_id,
  label,
  value,
  context,
  format,
  calculated_at
)
values
  (
    '60000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'Total Return',
    24.8,
    'Since inception',
    'percent',
    now()
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'Drawdown',
    -1.57,
    'Peak to trough',
    'percent',
    now()
  ),
  (
    '60000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000001',
    'Win Rate',
    75.0,
    '2 filled trades',
    'percent',
    now()
  ),
  (
    '60000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000001',
    'Sharpe Ratio',
    2.48,
    'Risk adjusted',
    'ratio',
    now()
  ),
  (
    '60000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000001',
    'Risk per Trade',
    0.3775,
    'Max capital at risk',
    'percent',
    now()
  )
on conflict (id) do nothing;

commit;

-- =========================================================
-- Verification counts
-- =========================================================
-- Supabase SQL Editor should return:
-- portfolio_snapshots: 1
-- assets: 5
-- positions: 4
-- trades: 4
-- reports: 4
-- performance_metrics: 5
select 'portfolio_snapshots' as table_name, count(*) as row_count
from portfolio_snapshots
where id = '10000000-0000-4000-8000-000000000001'
union all
select 'assets' as table_name, count(*) as row_count
from assets
where snapshot_id = '10000000-0000-4000-8000-000000000001'
union all
select 'positions' as table_name, count(*) as row_count
from positions
where snapshot_id = '10000000-0000-4000-8000-000000000001'
union all
select 'trades' as table_name, count(*) as row_count
from trades
where snapshot_id = '10000000-0000-4000-8000-000000000001'
union all
select 'reports' as table_name, count(*) as row_count
from reports
where snapshot_id = '10000000-0000-4000-8000-000000000001'
union all
select 'performance_metrics' as table_name, count(*) as row_count
from performance_metrics
where snapshot_id = '10000000-0000-4000-8000-000000000001';
