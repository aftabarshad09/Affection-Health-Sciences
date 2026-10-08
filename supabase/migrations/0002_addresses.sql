create table if not exists public.addresses (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  receiver_name text not null,
  phone text not null,
  province text not null,
  city text not null,
  area text,
  postal_code text,
  address_line text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses(user_id);

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();
