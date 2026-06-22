create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table admin_users enable row level security;

drop policy if exists "Authenticated admins can read own admin record" on admin_users;

create policy "Authenticated admins can read own admin record"
on admin_users
for select
to authenticated
using (auth.uid() = user_id);

drop trigger if exists set_admin_users_updated_at on admin_users;

create trigger set_admin_users_updated_at
before update on admin_users
for each row execute function set_updated_at();
