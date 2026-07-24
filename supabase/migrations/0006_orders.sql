create sequence if not exists public.order_number_seq;

create table if not exists public.orders (
  id bigserial primary key,
  order_number text not null unique,
  user_id uuid not null references public.profiles(id),
  address jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null,
  payment_method text not null default 'cod' check (payment_method = 'cod'),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid')),
  order_status text not null default 'pending' check (order_status in
    ('pending','confirmed','packed','shipped','out_for_delivery','delivered','cancelled','returned')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_order_status_idx on public.orders(order_status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  title text not null,
  sku text,
  price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  subtotal numeric(10,2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

create table if not exists public.order_timeline (
  id bigserial primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  status text not null,
  updated_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists order_timeline_order_id_idx on public.order_timeline(order_id);

-- Atomically places an order: row-locks and validates stock for every item,
-- computes subtotal/shipping/tax/grand_total server-side only (client-submitted
-- totals are never trusted), generates the order number, writes the order +
-- snapshot order_items + initial timeline entry, and decrements stock.
-- Because this all runs inside one Postgres function call, it is one
-- transaction — concurrent orders can't oversell the same stock.
create or replace function public.place_order(
  p_user_id uuid,
  p_address jsonb,
  p_items jsonb, -- [{"product_id": 1, "quantity": 2}, ...]
  p_notes text default null
)
returns public.orders
language plpgsql
security definer set search_path = public
as $$
declare
  v_item record;
  v_product record;
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_tax numeric(10,2) := 0;
  v_grand_total numeric(10,2) := 0;
  v_settings record;
  v_order public.orders;
  v_order_number text;
  v_line_total numeric(10,2);
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cannot place an order with no items';
  end if;

  select * into v_settings from public.settings where id = 1;
  if not found then
    v_settings.flat_shipping_rate := 200;
    v_settings.free_shipping_threshold := 0;
    v_settings.tax_rate := 0;
  end if;

  -- Pass 1: lock every product row, validate availability/stock, sum subtotal.
  for v_item in select * from jsonb_to_recordset(p_items) as x(product_id bigint, quantity int)
  loop
    if v_item.product_id is null or v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Invalid order item';
    end if;

    select * into v_product from public.products
      where id = v_item.product_id and commerce_status = 'active'
      for update;

    if not found then
      raise exception 'Product % is not available for purchase', v_item.product_id;
    end if;

    if v_product.stock < v_item.quantity then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    v_line_total := coalesce(v_product.sale_price, v_product.retail_price) * v_item.quantity;
    v_subtotal := v_subtotal + v_line_total;
  end loop;

  v_shipping := v_settings.flat_shipping_rate;
  if v_settings.free_shipping_threshold > 0 and v_subtotal >= v_settings.free_shipping_threshold then
    v_shipping := 0;
  end if;
  v_tax := round(v_subtotal * coalesce(v_settings.tax_rate, 0) / 100, 2);
  v_grand_total := v_subtotal + v_shipping + v_tax;

  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
    lpad(nextval('public.order_number_seq')::text, 6, '0');

  insert into public.orders (
    order_number, user_id, address, subtotal, shipping, discount, tax, grand_total, notes
  ) values (
    v_order_number, p_user_id, p_address, v_subtotal, v_shipping, 0, v_tax, v_grand_total, p_notes
  ) returning * into v_order;

  -- Pass 2: snapshot each line item and decrement stock (rows already locked above).
  for v_item in select * from jsonb_to_recordset(p_items) as x(product_id bigint, quantity int)
  loop
    select * into v_product from public.products where id = v_item.product_id;

    insert into public.order_items (order_id, product_id, title, sku, price, quantity, subtotal)
    values (
      v_order.id, v_product.id, v_product.name, v_product.sku,
      coalesce(v_product.sale_price, v_product.retail_price), v_item.quantity,
      coalesce(v_product.sale_price, v_product.retail_price) * v_item.quantity
    );

    update public.products set stock = stock - v_item.quantity where id = v_product.id;
  end loop;

  insert into public.order_timeline (order_id, status, updated_by, notes)
  values (v_order.id, 'pending', p_user_id, 'Order placed by customer');

  delete from public.cart_items
    where cart_id in (select id from public.carts where user_id = p_user_id);

  return v_order;
end;
$$;
