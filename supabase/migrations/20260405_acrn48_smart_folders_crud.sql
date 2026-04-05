-- ACRN-48
-- Carpetas inteligentes: estructura + RLS

create table if not exists public.smart_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.smart_folder_rules (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.smart_folders (id) on delete cascade,
  field text not null,
  operator text not null,
  value jsonb not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_smart_folders_user_created_at
on public.smart_folders (user_id, created_at desc);

create index if not exists idx_smart_folder_rules_folder_position
on public.smart_folder_rules (folder_id, position);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_smart_folders_touch_updated_at on public.smart_folders;
create trigger trg_smart_folders_touch_updated_at
before update on public.smart_folders
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_smart_folder_rules_touch_updated_at on public.smart_folder_rules;
create trigger trg_smart_folder_rules_touch_updated_at
before update on public.smart_folder_rules
for each row
execute function public.touch_updated_at();

alter table public.smart_folders enable row level security;
alter table public.smart_folder_rules enable row level security;

drop policy if exists "smart_folders_select_own" on public.smart_folders;
create policy "smart_folders_select_own"
on public.smart_folders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "smart_folders_insert_own" on public.smart_folders;
create policy "smart_folders_insert_own"
on public.smart_folders
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "smart_folders_update_own" on public.smart_folders;
create policy "smart_folders_update_own"
on public.smart_folders
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "smart_folders_delete_own" on public.smart_folders;
create policy "smart_folders_delete_own"
on public.smart_folders
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "smart_folder_rules_select_own" on public.smart_folder_rules;
create policy "smart_folder_rules_select_own"
on public.smart_folder_rules
for select
to authenticated
using (
  exists (
    select 1
    from public.smart_folders sf
    where sf.id = smart_folder_rules.folder_id
      and sf.user_id = auth.uid()
  )
);

drop policy if exists "smart_folder_rules_insert_own" on public.smart_folder_rules;
create policy "smart_folder_rules_insert_own"
on public.smart_folder_rules
for insert
to authenticated
with check (
  exists (
    select 1
    from public.smart_folders sf
    where sf.id = smart_folder_rules.folder_id
      and sf.user_id = auth.uid()
  )
);

drop policy if exists "smart_folder_rules_update_own" on public.smart_folder_rules;
create policy "smart_folder_rules_update_own"
on public.smart_folder_rules
for update
to authenticated
using (
  exists (
    select 1
    from public.smart_folders sf
    where sf.id = smart_folder_rules.folder_id
      and sf.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.smart_folders sf
    where sf.id = smart_folder_rules.folder_id
      and sf.user_id = auth.uid()
  )
);

drop policy if exists "smart_folder_rules_delete_own" on public.smart_folder_rules;
create policy "smart_folder_rules_delete_own"
on public.smart_folder_rules
for delete
to authenticated
using (
  exists (
    select 1
    from public.smart_folders sf
    where sf.id = smart_folder_rules.folder_id
      and sf.user_id = auth.uid()
  )
);
