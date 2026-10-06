-- Checkout writes: run in Supabase Dashboard → SQL Editor.
-- Allows buyers/sellers/admin to create the deliveries row + PIN at checkout,
-- and clients to insert notifications (fan-out until Edge triggers exist).

-- deliveries INSERT: buyer owns the order, seller owns the store, admin all.
drop policy if exists "deliveries party insert" on public.deliveries;
create policy "deliveries party insert" on public.deliveries
  for insert with check (
    exists (
      select 1 from public.orders o where o.id = order_id and (
        o.buyer_id = auth.uid()
        or o.seller_id in (select id from public.sellers where owner_id = auth.uid())
      )
    )
    or public.is_admin()
  );

-- notifications INSERT: any authenticated user (demo fan-out; tighten later
-- to server-side triggers once supabase/functions/verify-paystack ships).
drop policy if exists "notifications client insert" on public.notifications;
create policy "notifications client insert" on public.notifications
  for insert with check (auth.role() = 'authenticated');
