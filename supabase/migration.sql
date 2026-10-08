-- Vento initial schema: profiles, sellers, catalogue, orders, deliveries,
-- payouts, messaging, notifications, dish photo storage. Re-runnable.
-- Run once in Supabase Dashboard → SQL Editor.

-- ── profiles ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  phone text,
  role text not null default 'buyer'
    check (role in ('buyer', 'seller', 'delivery_agent', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'buyer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── helpers (after tables: SQL functions validate bodies at creation) ────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ── sellers / kitchens ───────────────────────────────────────────────────
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  store_name text not null,
  description text not null default '',
  approved boolean not null default false,
  verification_status text not null default 'pending',
  total_earnings integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── catalogue ────────────────────────────────────────────────────────────
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.sellers(id) on delete cascade,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  category text not null default 'mains',
  prep_time integer not null default 25,
  available boolean not null default true,
  image_url text,
  created_at timestamptz not null default now()
);

-- ── orders ───────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.sellers(id),
  agent_id uuid references public.profiles(id),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'preparing', 'picked_up', 'on_the_way', 'delivered', 'cancelled')),
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  delivery_address text not null default '',
  notes text,
  payment_method text not null default 'pod'
    check (payment_method in ('pod', 'paystack')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name text not null,
  price integer not null,
  quantity integer not null default 1,
  image_url text
);

-- ── deliveries ───────────────────────────────────────────────────────────
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  agent_id uuid references public.profiles(id),
  status text not null default 'assigned'
    check (status in ('assigned', 'heading_to_seller', 'picked_up', 'on_the_way', 'delivered', 'cancelled')),
  delivery_fee integer not null default 0,
  pin text,
  created_at timestamptz not null default now()
);

-- ── payouts ──────────────────────────────────────────────────────────────
create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id),
  amount integer not null check (amount > 0),
  method text not null default 'bank_transfer',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'completed', 'rejected')),
  created_at timestamptz not null default now()
);

-- ── messaging (one thread per order) ─────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- ── notifications ────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'order'
    check (kind in ('order', 'deal', 'wallet')),
  title text not null,
  body text not null default '',
  image_url text,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── storage ──────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('dish-photos', 'dish-photos', true)
on conflict (id) do nothing;

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.withdrawals enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- profiles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = id);

-- sellers
drop policy if exists "sellers browse approved" on public.sellers;
create policy "sellers browse approved" on public.sellers
  for select using (approved = true or owner_id = auth.uid() or public.is_admin());
drop policy if exists "sellers owner insert" on public.sellers;
create policy "sellers owner insert" on public.sellers
  for insert with check (owner_id = auth.uid());
drop policy if exists "sellers owner update" on public.sellers;
create policy "sellers owner update" on public.sellers
  for update using (owner_id = auth.uid() or public.is_admin());

-- menu_items
drop policy if exists "menu browse" on public.menu_items;
create policy "menu browse" on public.menu_items
  for select using (
    available = true or seller_id in (
      select id from public.sellers where owner_id = auth.uid()
    ) or public.is_admin()
  );
drop policy if exists "menu owner write" on public.menu_items;
create policy "menu owner write" on public.menu_items
  for all using (
    seller_id in (select id from public.sellers where owner_id = auth.uid())
    or public.is_admin()
  );

-- orders
drop policy if exists "orders party read" on public.orders;
create policy "orders party read" on public.orders
  for select using (
    buyer_id = auth.uid()
    or agent_id = auth.uid()
    or seller_id in (select id from public.sellers where owner_id = auth.uid())
    or public.is_admin()
  );
drop policy if exists "orders buyer create" on public.orders;
create policy "orders buyer create" on public.orders
  for insert with check (buyer_id = auth.uid());
drop policy if exists "orders party update" on public.orders;
create policy "orders party update" on public.orders
  for update using (
    buyer_id = auth.uid()
    or agent_id = auth.uid()
    or seller_id in (select id from public.sellers where owner_id = auth.uid())
    or public.is_admin()
  );

-- order_items (follow the parent order)
drop policy if exists "order items party read" on public.order_items;
create policy "order items party read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (
        o.buyer_id = auth.uid()
        or o.agent_id = auth.uid()
        or o.seller_id in (select id from public.sellers where owner_id = auth.uid())
        or public.is_admin()
      )
    )
  );
drop policy if exists "order items buyer create" on public.order_items;
create policy "order items buyer create" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.buyer_id = auth.uid()
    )
  );

-- deliveries
drop policy if exists "deliveries party read" on public.deliveries;
create policy "deliveries party read" on public.deliveries
  for select using (
    agent_id = auth.uid()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and (
        o.buyer_id = auth.uid()
        or o.seller_id in (select id from public.sellers where owner_id = auth.uid())
      )
    )
    or public.is_admin()
  );
drop policy if exists "deliveries agent update" on public.deliveries;
create policy "deliveries agent update" on public.deliveries
  for update using (agent_id = auth.uid() or public.is_admin());

-- withdrawals
drop policy if exists "withdrawals own read" on public.withdrawals;
create policy "withdrawals own read" on public.withdrawals
  for select using (requester_id = auth.uid() or public.is_admin());
drop policy if exists "withdrawals own create" on public.withdrawals;
create policy "withdrawals own create" on public.withdrawals
  for insert with check (requester_id = auth.uid());
drop policy if exists "withdrawals admin update" on public.withdrawals;
create policy "withdrawals admin update" on public.withdrawals
  for update using (public.is_admin());

-- messages (order participants only)
drop policy if exists "messages participant read" on public.messages;
create policy "messages participant read" on public.messages
  for select using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and (
        o.buyer_id = auth.uid()
        or o.agent_id = auth.uid()
        or o.seller_id in (select id from public.sellers where owner_id = auth.uid())
      )
    )
    or public.is_admin()
  );
drop policy if exists "messages participant send" on public.messages;
create policy "messages participant send" on public.messages
  for insert with check (sender_id = auth.uid());

-- notifications
drop policy if exists "notifications own" on public.notifications;
create policy "notifications own" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "notifications own update" on public.notifications;
create policy "notifications own update" on public.notifications
  for update using (user_id = auth.uid() or public.is_admin());

-- storage: public read, authenticated write
drop policy if exists "dish photos public read" on storage.objects;
create policy "dish photos public read" on storage.objects
  for select using (bucket_id = 'dish-photos');
drop policy if exists "dish photos auth write" on storage.objects;
create policy "dish photos auth write" on storage.objects
  for insert with check (bucket_id = 'dish-photos' and auth.role() = 'authenticated');
