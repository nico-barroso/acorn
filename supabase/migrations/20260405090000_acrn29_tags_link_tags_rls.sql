-- ACRN-29
-- RLS for tags and tag-resource relation tables (item_tags/link_tags)

-- ---------------------------------------------------------------------------
-- tags
-- ---------------------------------------------------------------------------
alter table if exists public.tags enable row level security;
alter table if exists public.tags force row level security;

drop policy if exists "tags_select_own" on public.tags;
create policy "tags_select_own"
on public.tags
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tags_insert_own" on public.tags;
create policy "tags_insert_own"
on public.tags
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "tags_update_own" on public.tags;
create policy "tags_update_own"
on public.tags
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tags_delete_own" on public.tags;
create policy "tags_delete_own"
on public.tags
for delete
to authenticated
using (auth.uid() = user_id);

-- Remove legacy broad policies if they exist
drop policy if exists "Users can view own tags" on public.tags;
drop policy if exists "Users can insert own tags" on public.tags;
drop policy if exists "Users can update own tags" on public.tags;
drop policy if exists "Users can delete own tags" on public.tags;

-- ---------------------------------------------------------------------------
-- item_tags (current relation table in this repo)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'item_tags'
  ) then
    execute 'alter table public.item_tags enable row level security';
    execute 'alter table public.item_tags force row level security';

    execute 'drop policy if exists "item_tags_select_own" on public.item_tags';
    execute $sql$
      create policy "item_tags_select_own"
      on public.item_tags
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.items i
          where i.id = item_tags.item_id
            and i.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.tags t
          where t.id = item_tags.tag_id
            and t.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "item_tags_insert_own" on public.item_tags';
    execute $sql$
      create policy "item_tags_insert_own"
      on public.item_tags
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.items i
          where i.id = item_tags.item_id
            and i.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.tags t
          where t.id = item_tags.tag_id
            and t.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "item_tags_delete_own" on public.item_tags';
    execute $sql$
      create policy "item_tags_delete_own"
      on public.item_tags
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.items i
          where i.id = item_tags.item_id
            and i.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.tags t
          where t.id = item_tags.tag_id
            and t.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "item_tags_update_own" on public.item_tags';
    execute $sql$
      create policy "item_tags_update_own"
      on public.item_tags
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.items i
          where i.id = item_tags.item_id
            and i.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.tags t
          where t.id = item_tags.tag_id
            and t.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.items i
          where i.id = item_tags.item_id
            and i.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.tags t
          where t.id = item_tags.tag_id
            and t.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "Users can view own item_tags" on public.item_tags';
    execute 'drop policy if exists "Users can insert own item_tags" on public.item_tags';
    execute 'drop policy if exists "Users can update own item_tags" on public.item_tags';
    execute 'drop policy if exists "Users can delete own item_tags" on public.item_tags';
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- link_tags (legacy/alternative naming)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'link_tags'
  ) then
    execute 'alter table public.link_tags enable row level security';
    execute 'alter table public.link_tags force row level security';

    execute 'drop policy if exists "link_tags_select_own" on public.link_tags';
    execute $sql$
      create policy "link_tags_select_own"
      on public.link_tags
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.tags t
          where t.id = link_tags.tag_id
            and t.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.items i
          where i.id = link_tags.link_id
            and i.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "link_tags_insert_own" on public.link_tags';
    execute $sql$
      create policy "link_tags_insert_own"
      on public.link_tags
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.tags t
          where t.id = link_tags.tag_id
            and t.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.items i
          where i.id = link_tags.link_id
            and i.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "link_tags_delete_own" on public.link_tags';
    execute $sql$
      create policy "link_tags_delete_own"
      on public.link_tags
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.tags t
          where t.id = link_tags.tag_id
            and t.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.items i
          where i.id = link_tags.link_id
            and i.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "link_tags_update_own" on public.link_tags';
    execute $sql$
      create policy "link_tags_update_own"
      on public.link_tags
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.tags t
          where t.id = link_tags.tag_id
            and t.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.items i
          where i.id = link_tags.link_id
            and i.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.tags t
          where t.id = link_tags.tag_id
            and t.user_id = auth.uid()
        )
        and exists (
          select 1
          from public.items i
          where i.id = link_tags.link_id
            and i.user_id = auth.uid()
        )
      )
    $sql$;

    execute 'drop policy if exists "Users can view own link_tags" on public.link_tags';
    execute 'drop policy if exists "Users can insert own link_tags" on public.link_tags';
    execute 'drop policy if exists "Users can update own link_tags" on public.link_tags';
    execute 'drop policy if exists "Users can delete own link_tags" on public.link_tags';
  end if;
end
$$;
