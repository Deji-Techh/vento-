-- Push tokens: run in Supabase Dashboard → SQL Editor.
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null,
  platform text not null default 'android',
  created_at timestamptz not null default now(),
  unique (user_id, token)
);
alter table public.device_tokens enable row level security;
drop policy if exists "device tokens own" on public.device_tokens;
create policy "device tokens own" on public.device_tokens
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
