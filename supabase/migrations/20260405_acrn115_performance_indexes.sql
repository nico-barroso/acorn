-- ACRN-115
-- RNF-03 Rendimiento: indices para busqueda y listados

-- 1) Full-text index (title, description, notes/search_vector)
do $$
declare
  has_search_vector boolean;
  has_notes boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'items'
      and column_name = 'search_vector'
  ) into has_search_vector;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'items'
      and column_name = 'notes'
  ) into has_notes;

  if has_search_vector then
    execute 'create index if not exists idx_items_search_vector_gin on public.items using gin (search_vector)';
  elsif has_notes then
    execute $sql$
      create index if not exists idx_items_fts_expr_gin
      on public.items
      using gin (
        to_tsvector(
          ''simple'',
          coalesce(title, '''') || '' '' || coalesce(description, '''') || '' '' || coalesce(notes, '''')
        )
      )
    $sql$;
  else
    execute $sql$
      create index if not exists idx_items_fts_expr_gin
      on public.items
      using gin (
        to_tsvector(
          ''simple'',
          coalesce(title, '''') || '' '' || coalesce(description, '''')
        )
      )
    $sql$;
  end if;
end
$$;

-- 2) Listados paginados
create index if not exists idx_items_user_created_at
on public.items (user_id, created_at desc);

-- 3) Filtro por estado de lectura
create index if not exists idx_items_user_is_read
on public.items (user_id, is_read);

-- 4) Filtro por dominio
-- Si domain esta en items: indice directo (user_id, domain)
-- Si domain esta normalizado en links: indice compuesto equivalente para join eficiente
do $$
declare
  items_has_domain boolean;
  links_has_domain boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'items'
      and column_name = 'domain'
  ) into items_has_domain;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'links'
      and column_name = 'domain'
  ) into links_has_domain;

  if items_has_domain then
    execute 'create index if not exists idx_items_user_domain on public.items (user_id, domain)';
  elsif links_has_domain then
    execute 'create index if not exists idx_links_domain_id on public.links (domain, id)';
    execute 'create index if not exists idx_items_user_id_id on public.items (user_id, id)';
  end if;
end
$$;
