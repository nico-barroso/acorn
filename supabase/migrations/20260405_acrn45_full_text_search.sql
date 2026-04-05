-- ACRN-45
-- Full-text search sobre items (titulo, descripcion y etiquetas)

-- 1) Columna tsvector en items
alter table public.items
add column if not exists search_vector tsvector;

-- 2) Funcion para construir el vector de busqueda de un item
create or replace function public.build_item_search_vector(
  p_item_id uuid,
  p_title text,
  p_description text
)
returns tsvector
language sql
stable
as $$
  with tag_text as (
    select coalesce(string_agg(t.name, ' ' order by t.name), '') as names
    from public.item_tags it
    join public.tags t on t.id = it.tag_id
    where it.item_id = p_item_id
  )
  select
    setweight(to_tsvector('simple', coalesce(p_title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(p_description, '')), 'B') ||
    setweight(to_tsvector('simple', (select names from tag_text)), 'C');
$$;

-- 3) Trigger BEFORE INSERT/UPDATE para mantener search_vector con cambios en items
create or replace function public.items_search_vector_trigger()
returns trigger
language plpgsql
as $$
begin
  new.search_vector := public.build_item_search_vector(new.id, new.title, new.description);
  return new;
end;
$$;

drop trigger if exists trg_items_search_vector_before_write on public.items;
create trigger trg_items_search_vector_before_write
before insert or update of title, description
on public.items
for each row
execute function public.items_search_vector_trigger();

-- 4) Funcion util para recalcular vector de un item concreto
create or replace function public.refresh_item_search_vector(p_item_id uuid)
returns void
language plpgsql
as $$
begin
  update public.items i
  set search_vector = public.build_item_search_vector(i.id, i.title, i.description)
  where i.id = p_item_id;
end;
$$;

-- 5) Trigger en item_tags para refrescar vector cuando se asigna/desasigna etiqueta
create or replace function public.refresh_item_search_vector_from_item_tags()
returns trigger
language plpgsql
as $$
begin
  perform public.refresh_item_search_vector(coalesce(new.item_id, old.item_id));
  return null;
end;
$$;

drop trigger if exists trg_refresh_item_search_vector_on_item_tags on public.item_tags;
create trigger trg_refresh_item_search_vector_on_item_tags
after insert or update or delete
on public.item_tags
for each row
execute function public.refresh_item_search_vector_from_item_tags();

-- 6) Trigger en tags para refrescar vectors al renombrar etiquetas
create or replace function public.refresh_item_search_vector_from_tags()
returns trigger
language plpgsql
as $$
begin
  update public.items i
  set search_vector = public.build_item_search_vector(i.id, i.title, i.description)
  where exists (
    select 1
    from public.item_tags it
    where it.item_id = i.id
      and it.tag_id = new.id
  );

  return null;
end;
$$;

drop trigger if exists trg_refresh_item_search_vector_on_tags on public.tags;
create trigger trg_refresh_item_search_vector_on_tags
after update of name
on public.tags
for each row
execute function public.refresh_item_search_vector_from_tags();

-- 7) Backfill inicial de search_vector
update public.items i
set search_vector = public.build_item_search_vector(i.id, i.title, i.description)
where i.search_vector is null
   or i.search_vector = ''::tsvector;

-- 8) Indice GIN para busqueda full-text
create index if not exists idx_items_search_vector
on public.items
using gin (search_vector);

-- 9) Funcion de consulta full-text para uso desde backend/edge functions
create or replace function public.search_items_full_text(
  p_user_id uuid,
  p_query text,
  p_limit integer default 20,
  p_offset integer default 0
)
returns table (
  item_id uuid,
  item_type text,
  title text,
  description text,
  is_read boolean,
  is_favorite boolean,
  created_at timestamptz,
  updated_at timestamptz,
  rank real
)
language sql
stable
as $$
  with input as (
    select nullif(trim(p_query), '') as qtxt
  ),
  q as (
    select websearch_to_tsquery('simple', qtxt) as tsq
    from input
    where qtxt is not null
  )
  select
    i.id as item_id,
    i.type as item_type,
    i.title,
    i.description,
    i.is_read,
    i.is_favorite,
    i.created_at,
    i.updated_at,
    ts_rank_cd(i.search_vector, q.tsq) as rank
  from public.items i
  join q on true
  where i.user_id = p_user_id
    and i.search_vector @@ q.tsq
  order by rank desc, i.created_at desc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;
