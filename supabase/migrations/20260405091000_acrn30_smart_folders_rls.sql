-- ACRN-30
-- RLS for smart_folders and smart_folder_rules

-- Ensure RLS is enabled and enforced
alter table if exists public.smart_folders enable row level security;
alter table if exists public.smart_folders force row level security;

alter table if exists public.smart_folder_rules enable row level security;
alter table if exists public.smart_folder_rules force row level security;

-- Remove legacy broad policies (role public)
drop policy if exists "Users can view own smart_folders" on public.smart_folders;
drop policy if exists "Users can insert own smart_folders" on public.smart_folders;
drop policy if exists "Users can update own smart_folders" on public.smart_folders;
drop policy if exists "Users can delete own smart_folders" on public.smart_folders;

drop policy if exists "Users can view own smart_folder_rules" on public.smart_folder_rules;
drop policy if exists "Users can insert own smart_folder_rules" on public.smart_folder_rules;
drop policy if exists "Users can update own smart_folder_rules" on public.smart_folder_rules;
drop policy if exists "Users can delete own smart_folder_rules" on public.smart_folder_rules;

-- smart_folders policies
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

-- smart_folder_rules policies
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
