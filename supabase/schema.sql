-- ─────────────────────────────────────────────────────────────
-- Boston Mattress® — Supabase schema
-- Run in the Supabase SQL editor after creating the project.
-- ─────────────────────────────────────────────────────────────

-- Readable order ids: BM-YYYY-NNNN
create sequence if not exists order_seq start 1;

create or replace function generate_order_id()
returns text
language plpgsql
as $$
begin
  return 'BM-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('order_seq')::text, 4, '0');
end;
$$;

-- Orders
create table if not exists orders (
  id text primary key default generate_order_id(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  customer_name text not null,
  phone text not null,
  whatsapp_number text,
  city text not null,
  address text not null,
  mattress_size text not null check (mattress_size in ('single','double','queen','king')),
  quantity integer not null check (quantity between 1 and 5),
  unit_price integer not null,
  total_amount integer not null,
  payment_method text not null default 'bank_transfer' check (payment_method in ('bank_transfer','cod')),
  order_notes text,
  admin_notes text,
  status text not null default 'new' check (status in ('new','confirmed','shipped','delivered','cancelled'))
);

-- Status history
create table if not exists order_status_history (
  id uuid default gen_random_uuid() primary key,
  order_id text references orders(id) on delete cascade,
  status text not null,
  changed_at timestamptz default now(),
  note text
);

create index if not exists idx_orders_created_at on orders (created_at desc);
create index if not exists idx_orders_status on orders (status);

-- ── Pricing / discounts (admin-managed) ──
-- One row per sellable size. `discount_price` (when set and below `price`)
-- becomes the active price; the store shows `price` struck through, the
-- discounted value in its place, and `discount_label` as a tag.
create table if not exists size_pricing (
  size text primary key check (size in ('single','double','queen','king')),
  price integer not null,
  discount_price integer,
  discount_label text,
  updated_at timestamptz default now()
);

-- Seed the two launch sizes (no-op if rows already exist).
insert into size_pricing (size, price) values
  ('queen', 75000),
  ('king', 85000)
on conflict (size) do nothing;

-- ── Row-level security ──
alter table orders enable row level security;
alter table size_pricing enable row level security;

-- Public may place orders; only the service role can read/update them.
create policy "Public can insert orders"
  on orders for insert with check (true);
create policy "Service role can read orders"
  on orders for select using (auth.role() = 'service_role');
create policy "Service role can update orders"
  on orders for update using (auth.role() = 'service_role');

-- Pricing is world-readable (store display); only the service role writes.
create policy "Anyone can read pricing"
  on size_pricing for select using (true);
create policy "Service role can write pricing"
  on size_pricing for all using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
