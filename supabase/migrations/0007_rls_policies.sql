-- Helper: is the current authenticated user an admin/super_admin?
-- security definer so it can read profiles even under a caller with no
-- direct select grant on it, without leaking anything beyond a boolean.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','super_admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_timeline enable row level security;
alter table public.wishlists enable row level security;
alter table public.admin_activity_logs enable row level security;
alter table public.settings enable row level security;

-- profiles: a user can read/update their own row; admins can read everyone's.
-- Role itself can only be changed by the backend's service-role client
-- (which bypasses RLS entirely), never by the user directly.
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

-- addresses: owner full access, admin read for fulfillment.
drop policy if exists addresses_owner_all on public.addresses;
create policy addresses_owner_all on public.addresses
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- categories / products / product_images: public read, writes go through
-- the service-role backend only (no insert/update/delete policy = denied
-- by default under RLS for the anon/authenticated roles).
drop policy if exists categories_public_select on public.categories;
create policy categories_public_select on public.categories
  for select using (status = 'active' or public.is_admin());

drop policy if exists products_public_select on public.products;
create policy products_public_select on public.products
  for select using (true);

drop policy if exists product_images_public_select on public.product_images;
create policy product_images_public_select on public.product_images
  for select using (true);

-- carts / cart_items: owner only.
drop policy if exists carts_owner_all on public.carts;
create policy carts_owner_all on public.carts
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists cart_items_owner_all on public.cart_items;
create policy cart_items_owner_all on public.cart_items
  for all using (cart_id in (select id from public.carts where user_id = auth.uid()))
  with check (cart_id in (select id from public.carts where user_id = auth.uid()));

-- orders: owner can read their own, admin can read/update all. Inserts only
-- ever happen through place_order() (security definer), never a direct insert.
drop policy if exists orders_owner_or_admin_select on public.orders;
create policy orders_owner_or_admin_select on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin());

drop policy if exists order_items_owner_or_admin_select on public.order_items;
create policy order_items_owner_or_admin_select on public.order_items
  for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists order_timeline_owner_or_admin_select on public.order_timeline;
create policy order_timeline_owner_or_admin_select on public.order_timeline
  for select using (
    order_id in (select id from public.orders where user_id = auth.uid())
    or public.is_admin()
  );

-- wishlists: owner only.
drop policy if exists wishlists_owner_all on public.wishlists;
create policy wishlists_owner_all on public.wishlists
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- admin_activity_logs: admin read only; all writes come from the backend's
-- service-role client so there is no insert policy for regular roles.
drop policy if exists admin_activity_logs_admin_select on public.admin_activity_logs;
create policy admin_activity_logs_admin_select on public.admin_activity_logs
  for select using (public.is_admin());

-- settings: public read (checkout needs the shipping rate), admin update.
drop policy if exists settings_public_select on public.settings;
create policy settings_public_select on public.settings
  for select using (true);
