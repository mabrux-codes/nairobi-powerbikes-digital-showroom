
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Updated-at helper
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Bikes
create table public.bikes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null,
  type text not null,
  price bigint not null default 0,
  engine integer not null default 0,
  power text not null default '',
  year integer not null default extract(year from now())::int,
  mileage text not null default '0 km',
  condition text not null default 'Brand New',
  transmission text not null default '',
  badge text,
  image text not null default '',
  images jsonb not null default '[]'::jsonb,
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  available boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bikes enable row level security;
create trigger bikes_updated before update on public.bikes
for each row execute function public.tg_set_updated_at();

create policy "public read published bikes" on public.bikes for select
using (published = true or public.has_role(auth.uid(), 'admin'));
create policy "admins manage bikes" on public.bikes for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid references public.bikes(id) on delete set null,
  bike_name text,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new',
  follow_up_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create trigger inquiries_updated before update on public.inquiries
for each row execute function public.tg_set_updated_at();

create policy "anyone submits inquiry" on public.inquiries for insert with check (true);
create policy "admins read inquiries" on public.inquiries for select to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "admins update inquiries" on public.inquiries for update to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "admins delete inquiries" on public.inquiries for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Test rides
create table public.test_rides (
  id uuid primary key default gen_random_uuid(),
  bike_id uuid references public.bikes(id) on delete set null,
  bike_name text,
  name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time time not null,
  notes text,
  license_url text,
  status text not null default 'pending',
  follow_up_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.test_rides enable row level security;
create trigger test_rides_updated before update on public.test_rides
for each row execute function public.tg_set_updated_at();

create policy "anyone submits test ride" on public.test_rides for insert with check (true);
create policy "admins read test rides" on public.test_rides for select to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "admins update test rides" on public.test_rides for update to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "admins delete test rides" on public.test_rides for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Site settings (singleton)
create table public.site_settings (
  id integer primary key default 1,
  site_name text not null default 'Nairobi Powerbikes',
  logo_url text,
  contact_email text,
  contact_phone text,
  whatsapp_number text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
alter table public.site_settings enable row level security;
create trigger site_settings_updated before update on public.site_settings
for each row execute function public.tg_set_updated_at();
insert into public.site_settings (id) values (1) on conflict do nothing;

create policy "public read site settings" on public.site_settings for select using (true);
create policy "admins update site settings" on public.site_settings for update to authenticated
using (public.has_role(auth.uid(), 'admin'));
create policy "admins insert site settings" on public.site_settings for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

-- Storage buckets
insert into storage.buckets (id, name, public) values
  ('bike-images', 'bike-images', true),
  ('site-assets', 'site-assets', true),
  ('test-ride-licenses', 'test-ride-licenses', false)
on conflict (id) do nothing;

-- Public read for public buckets
create policy "public read bike images" on storage.objects for select
using (bucket_id = 'bike-images');
create policy "public read site assets" on storage.objects for select
using (bucket_id = 'site-assets');

-- Admin write for bike images & site assets
create policy "admins write bike images" on storage.objects for insert to authenticated
with check (bucket_id = 'bike-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins update bike images" on storage.objects for update to authenticated
using (bucket_id = 'bike-images' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete bike images" on storage.objects for delete to authenticated
using (bucket_id = 'bike-images' and public.has_role(auth.uid(), 'admin'));

create policy "admins write site assets" on storage.objects for insert to authenticated
with check (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
create policy "admins update site assets" on storage.objects for update to authenticated
using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete site assets" on storage.objects for delete to authenticated
using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));

-- Anyone can upload license (used during booking); admins manage
create policy "anyone upload license" on storage.objects for insert
with check (bucket_id = 'test-ride-licenses');
create policy "admins read licenses" on storage.objects for select to authenticated
using (bucket_id = 'test-ride-licenses' and public.has_role(auth.uid(), 'admin'));
create policy "admins delete licenses" on storage.objects for delete to authenticated
using (bucket_id = 'test-ride-licenses' and public.has_role(auth.uid(), 'admin'));
