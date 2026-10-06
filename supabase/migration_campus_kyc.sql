-- Campus + uni-ID verification. Run in Supabase Dashboard → SQL Editor.
-- Vento is universities-only; launch campus = Igbinedion University (Okada).
-- Sellers/riders verify with uni ID + bank (no gov ID uploads).

-- Seller verification detail (existing sellers table keeps working without this;
-- verification.tsx upserts summary into description until this is applied).
alter table public.sellers add column if not exists campus_id text not null default 'iuok';
alter table public.sellers add column if not exists uni_id_number text;
alter table public.sellers add column if not exists hostel text;
alter table public.sellers add column if not exists bank_name text;
alter table public.sellers add column if not exists account_number text;
alter table public.sellers add column if not exists account_name text;

-- Rider verification requests (riders have no sellers row).
create table if not exists public.rider_verifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  campus_id text not null default 'iuok',
  uni_id_number text not null,
  hostel text not null default '',
  bank_name text not null,
  account_number text not null,
  account_name text not null,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected')),
  reviewer_note text,
  created_at timestamptz not null default now()
);
alter table public.rider_verifications enable row level security;
drop policy if exists "rider verif own" on public.rider_verifications;
create policy "rider verif own" on public.rider_verifications
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());
