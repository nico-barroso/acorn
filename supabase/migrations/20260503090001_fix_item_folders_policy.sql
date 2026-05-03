-- Fix ambiguous columns in item_folders policy

drop policy if exists "item_folders_insert_own" on public.item_folders;
create policy "item_folders_insert_own"
on public.item_folders
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.items i
    where i.id = item_folders.item_id and i.user_id = auth.uid()
  )
  and exists (
    select 1 from public.smart_folders sf
    where sf.id = item_folders.folder_id and sf.user_id = auth.uid()
  )
);
