-- Guest checkout: orders placed without a customer account.
-- Make user_id optional and store the customer's contact details directly on
-- the order (there is no profile row for a guest).
alter table public.orders alter column user_id drop not null;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_phone text;

-- Places a guest order atomically: computes subtotal from priced items
-- (items priced "on request" contribute 0 and are confirmed later), applies
-- shipping/tax from settings, generates the order number, and writes the
-- order + snapshot order_items + initial timeline entry. No login, no stock
-- decrement (COD store). Called by the service-role backend after Zod
-- validation of the form.
create or replace function public.place_guest_order(
  p_customer jsonb,   -- { name, email, phone }
  p_address jsonb,    -- { receiver_name, phone, email, apartment, address_line, area, city, province, postal_code }
  p_items jsonb,      -- [ { product_id, quantity } ]
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
  v_grand numeric(10,2) := 0;
  v_settings record;
  v_order public.orders;
  v_order_number text;
  v_price numeric(10,2);
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

  -- Pass 1: validate items and sum subtotal from priced items.
  for v_item in select * from jsonb_to_recordset(p_items) as x(product_id bigint, quantity int)
  loop
    if v_item.product_id is null or v_item.quantity is null or v_item.quantity <= 0 then
      raise exception 'Invalid order item';
    end if;
    select * into v_product from public.products where id = v_item.product_id;
    if not found then
      raise exception 'Product % not found', v_item.product_id;
    end if;
    v_price := coalesce(v_product.sale_price, v_product.retail_price, 0);
    v_subtotal := v_subtotal + v_price * v_item.quantity;
  end loop;

  v_shipping := v_settings.flat_shipping_rate;
  if v_settings.free_shipping_threshold > 0 and v_subtotal >= v_settings.free_shipping_threshold then
    v_shipping := 0;
  end if;
  v_tax := round(v_subtotal * coalesce(v_settings.tax_rate, 0) / 100, 2);
  v_grand := v_subtotal + v_shipping + v_tax;

  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' ||
    lpad(nextval('public.order_number_seq')::text, 6, '0');

  insert into public.orders (
    order_number, user_id, customer_name, customer_email, customer_phone,
    address, subtotal, shipping, discount, tax, grand_total, notes
  ) values (
    v_order_number, null, p_customer->>'name', p_customer->>'email', p_customer->>'phone',
    p_address, v_subtotal, v_shipping, 0, v_tax, v_grand, p_notes
  ) returning * into v_order;

  -- Pass 2: snapshot each line item (unpriced → price 0).
  for v_item in select * from jsonb_to_recordset(p_items) as x(product_id bigint, quantity int)
  loop
    select * into v_product from public.products where id = v_item.product_id;
    v_price := coalesce(v_product.sale_price, v_product.retail_price, 0);
    insert into public.order_items (order_id, product_id, title, sku, price, quantity, subtotal)
    values (v_order.id, v_product.id, v_product.name, v_product.sku, v_price, v_item.quantity, v_price * v_item.quantity);
  end loop;

  insert into public.order_timeline (order_id, status, updated_by, notes)
  values (v_order.id, 'pending', null, 'Order placed by customer');

  return v_order;
end;
$$;
