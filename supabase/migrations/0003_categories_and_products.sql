create table if not exists public.categories (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  image text,
  description text,
  status text not null default 'active' check (status in ('active','inactive')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- Extend the existing marketing `products` table with commerce fields.
-- Every new column is additive/nullable-or-defaulted so the current
-- marketing page (which only reads the pre-existing columns) keeps
-- working completely unmodified until the app is updated to use them.
alter table public.products
  add column if not exists sku text,
  add column if not exists slug text,
  add column if not exists category_id bigint references public.categories(id),
  add column if not exists retail_price numeric(10,2),
  add column if not exists sale_price numeric(10,2),
  add column if not exists stock int not null default 0,
  add column if not exists featured boolean not null default false,
  add column if not exists commerce_status text not null default 'draft'
    check (commerce_status in ('draft','active','archived')),
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists updated_by uuid references public.profiles(id),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists products_sku_unique_idx on public.products(sku) where sku is not null;
create unique index if not exists products_slug_unique_idx on public.products(slug) where slug is not null;
create index if not exists products_commerce_status_idx on public.products(commerce_status);
create index if not exists products_category_id_idx on public.products(category_id);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
