# Indices de rendimiento (ACRN-115)

Migracion: `supabase/migrations/20260405_acrn115_performance_indexes.sql`

## Indices creados

- Full-text index (`GIN`) para busqueda de texto sobre items.
  - Prioriza `items.search_vector` cuando existe.
  - Fallback a indice por expresion (`title + description + notes`) si no existe `search_vector`.
- Indice compuesto para listados paginados:
  - `idx_items_user_created_at` sobre `(user_id, created_at desc)`.
- Indice para filtro por estado de lectura:
  - `idx_items_user_is_read` sobre `(user_id, is_read)`.
- Indice para filtro por dominio:
  - Si `domain` esta en `items`: `idx_items_user_domain` sobre `(user_id, domain)`.
  - Si `domain` esta en `links`: `idx_links_domain_id` sobre `(domain, id)` y soporte de join `idx_items_user_id_id` sobre `(user_id, id)`.

## Verificacion recomendada (EXPLAIN ANALYZE)

```sql
explain analyze
select i.id, i.title, i.created_at
from public.items i
where i.user_id = '00000000-0000-0000-0000-000000000000'::uuid
order by i.created_at desc
limit 20 offset 0;
```

```sql
explain analyze
select i.id, i.title
from public.items i
where i.user_id = '00000000-0000-0000-0000-000000000000'::uuid
  and i.is_read = false
order by i.created_at desc
limit 20;
```

```sql
explain analyze
select i.id, i.title
from public.items i
join public.links l on l.id = i.id
where i.user_id = '00000000-0000-0000-0000-000000000000'::uuid
  and l.domain = 'openai.com'
order by i.created_at desc
limit 20;
```

```sql
explain analyze
select i.id, i.title
from public.items i
where i.user_id = '00000000-0000-0000-0000-000000000000'::uuid
  and i.search_vector @@ websearch_to_tsquery('simple', 'openai importante')
order by ts_rank_cd(i.search_vector, websearch_to_tsquery('simple', 'openai importante')) desc
limit 20;
```

El criterio de aceptacion se cumple cuando el plan muestra `Index Scan`/`Bitmap Index Scan` en lugar de `Seq Scan` para estos casos.
