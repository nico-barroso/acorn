-- ACRN-48 compatibility patch
-- Ensures existing smart folder tables match expected columns/types.

-- smart_folders table hardening
alter table if exists public.smart_folders
  add column if not exists description text;

alter table if exists public.smart_folders
  add column if not exists is_active boolean not null default true;

alter table if exists public.smart_folders
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.smart_folders
  add column if not exists updated_at timestamptz not null default now();

-- smart_folder_rules table hardening
alter table if exists public.smart_folder_rules
  add column if not exists field text;

alter table if exists public.smart_folder_rules
  add column if not exists operator text;

alter table if exists public.smart_folder_rules
  add column if not exists value text;

alter table if exists public.smart_folder_rules
  add column if not exists position integer not null default 0;

alter table if exists public.smart_folder_rules
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.smart_folder_rules
  add column if not exists updated_at timestamptz not null default now();

-- If legacy relation column exists, rename to folder_id
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smart_folder_rules'
      and column_name = 'smart_folder_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'smart_folder_rules'
      and column_name = 'folder_id'
  ) then
    execute 'alter table public.smart_folder_rules rename column smart_folder_id to folder_id';
  end if;
end
$$;

-- Ensure folder_id exists and is indexed
alter table if exists public.smart_folder_rules
  add column if not exists folder_id uuid;

-- Ensure value column is jsonb across legacy schemas
do $$
declare
  value_udt text;
begin
  select c.udt_name
  into value_udt
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'smart_folder_rules'
    and c.column_name = 'value';

  if value_udt is null then
    execute 'alter table public.smart_folder_rules add column value jsonb';
  elsif value_udt = 'jsonb' then
    null;
  elsif value_udt = 'json' then
    execute 'alter table public.smart_folder_rules alter column value type jsonb using value::jsonb';
  else
    execute 'alter table public.smart_folder_rules alter column value type jsonb using to_jsonb(value)';
  end if;
end
$$;

create index if not exists idx_smart_folder_rules_folder_position
on public.smart_folder_rules (folder_id, position);

-- Backfill NOT NULL expectations where possible
update public.smart_folder_rules
set field = coalesce(field, 'domain')
where field is null;

update public.smart_folder_rules
set operator = coalesce(operator, 'equals')
where operator is null;

update public.smart_folder_rules
set value = coalesce(value, 'null'::jsonb)
where value is null;

alter table if exists public.smart_folder_rules
  alter column field set not null;

alter table if exists public.smart_folder_rules
  alter column operator set not null;

alter table if exists public.smart_folder_rules
  alter column value set not null;
