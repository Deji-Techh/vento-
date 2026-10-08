-- Vento admin hardening: run once in Supabase Dashboard → SQL Editor.
-- Requires existing supabase/migration.sql applied.
-- Defaults agreed: delivery fee ₦1500 / free over ₦10000, commission 10%,
-- min withdrawal ₦1000, seller accept SLA 5 min, dispute window 24h.

-- 1. Never trust client-supplied role on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    case when new.raw_user_meta_data ->> 'role' in ('buyer', 'seller', 'delivery_agent')
      then new.raw_user_meta_data ->> 'role' else 'buyer' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Block self-promotion to admin (client can only change non-role fields;
-- role changes require is_admin()).
create or replace function public.prevent_role_self_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role <> old.role and not public.is_admin() then
    raise exception 'role change requires admin';
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_no_self_role on public.profiles;
create trigger profiles_no_self_role
  before update of role on public.profiles
  for each row execute function public.prevent_role_self_change();

-- 3. Admin-only listing writes stay intact via existing policies:
-- sellers owner insert (owner_id = auth.uid()) + menu owner write.
-- Admin bypasses via is_admin(). No change needed, documented here.

-- 4. Audit log for admin actions (approve/reject/assign/refund).
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id),
  action_type text not null,
  target_id text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.admin_actions enable row level security;
drop policy if exists "admin actions admin read" on public.admin_actions;
create policy "admin actions admin read" on public.admin_actions
  for select using (public.is_admin());
drop policy if exists "admin actions admin insert" on public.admin_actions;
create policy "admin actions admin insert" on public.admin_actions
  for insert with check (admin_id = auth.uid() and public.is_admin());

-- 5. Order status history (for buyer/seller/rider/admin timeline).
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.order_status_history enable row level security;
drop policy if exists "order history party read" on public.order_status_history;
create policy "order history party read" on public.order_status_history
  for select using (
    exists (
      select 1 from public.orders o where o.id = order_id and (
        o.buyer_id = auth.uid() or o.agent_id = auth.uid()
        or o.seller_id in (select id from public.sellers where owner_id = auth.uid())
        or public.is_admin()
      )
    )
  );
