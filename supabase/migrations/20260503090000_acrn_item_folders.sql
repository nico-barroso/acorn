-- ACRN - item_folders: relacion items <-> carpetas

create table if not exists public.item_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.items (id) on delete cascade,
  folder_id uuid not null references public.smart_folders (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (item_id, folder_id)
);

create index if not exists idx_item_folders_user_item
on public.item_folders (user_id, item_id);

create index if not exists idx_item_folders_user_folder
on public.item_folders (user_id, folder_id);

alter table public.item_folders enable row level security;

drop policy if exists "item_folders_select_own" on public.item_folders;
create policy "item_folders_select_own"
on public.item_folders
for select
to authenticated
using (
  auth.uid() = user_id
);

drop policy if exists "item_folders_insert_own" on public.item_folders;
create policy "item_folders_insert_own"
on public.item_folders
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.items i
    where i.id = item_id and i.user_id = auth.uid()
  )
  and exists (
    select 1 from public.smart_folders sf
    where sf.id = folder_id and sf.user_id = auth.uid()
  )
);

drop policy if exists "item_folders_delete_own" on public.item_folders;
create policy "item_folders_delete_own"
on public.item_folders
for delete
to authenticated
using (
  auth.uid() = user_id
);
