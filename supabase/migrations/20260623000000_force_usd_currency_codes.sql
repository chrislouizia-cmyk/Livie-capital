update portfolio_snapshots
set currency = 'USD'
where currency <> 'USD';

update assets
set currency = 'USD'
where currency <> 'USD';

update positions
set currency = 'USD'
where currency <> 'USD';

update trades
set currency = 'USD'
where currency <> 'USD';

alter table portfolio_snapshots alter column currency drop default;

create type currency_code_usd_only as enum ('USD');

alter table portfolio_snapshots
alter column currency type currency_code_usd_only
using 'USD'::currency_code_usd_only;

alter table assets
alter column currency type currency_code_usd_only
using 'USD'::currency_code_usd_only;

alter table positions
alter column currency type currency_code_usd_only
using 'USD'::currency_code_usd_only;

alter table trades
alter column currency type currency_code_usd_only
using 'USD'::currency_code_usd_only;

drop type currency_code;

alter type currency_code_usd_only rename to currency_code;

alter table portfolio_snapshots
alter column currency set default 'USD';
