-- Lost Sheep Found
-- Run this in the NEW Supabase project's SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  is_customizable boolean not null default false,
  is_featured boolean not null default false,
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10,2),
  stock integer not null default 0
);

create table if not exists public.customization_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text','select','textarea')),
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null default 0,
  customization jsonb not null default '{}'::jsonb
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.customization_options enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public can read categories"
on public.categories for select to anon, authenticated using (true);

create policy "public can read products"
on public.products for select to anon, authenticated using (true);

create policy "public can read product images"
on public.product_images for select to anon, authenticated using (true);

create policy "public can read product variants"
on public.product_variants for select to anon, authenticated using (true);

create policy "public can read customization options"
on public.customization_options for select to anon, authenticated using (true);

insert into public.categories (name, slug, description)
values
  ('Bible Journals', 'bible-journals', 'Journals for reflection, prayer and Scripture study.'),
  ('Bookmarks', 'bookmarks', 'Small reminders to keep close to your Bible.'),
  ('Wood Blocks', 'wood-blocks', 'Scripture pieces for meaningful spaces.'),
  ('Tote Bags', 'tote-bags', 'Faith-filled everyday carry pieces.'),
  ('Key Chains', 'key-chains', 'Little keepsakes for your everyday journey.')
on conflict (slug) do nothing;

insert into public.products
  (category_id, name, slug, description, price, is_customizable, is_featured, stock)
select
  c.id,
  'The Shepherd Journal',
  'the-shepherd-journal',
  'A beautiful journal inspired by Psalm 23, with room for your prayers and reflections.',
  420,
  true,
  true,
  20
from public.categories c
where c.slug = 'bible-journals'
on conflict (slug) do nothing;

insert into public.products
  (category_id, name, slug, description, price, is_customizable, is_featured, stock)
select
  c.id,
  'Psalm 23 Wood Block',
  'psalm-23-wood-block',
  'A hand-finished wooden scripture piece for a desk, shelf or bedside table.',
  350,
  true,
  true,
  15
from public.categories c
where c.slug = 'wood-blocks'
on conflict (slug) do nothing;
