create table if not exists public.settings (
  id int primary key default 1,
  flat_shipping_rate numeric(10,2) not null default 200,
  free_shipping_threshold numeric(10,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id),
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

create table if not exists public.wishlists (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.admin_activity_logs (
  id bigserial primary key,
  admin_id uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_logs_admin_id_idx on public.admin_activity_logs(admin_id);
create index if not exists admin_activity_logs_created_at_idx on public.admin_activity_logs(created_at desc);
