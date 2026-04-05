# Full-text search (ACRN-45)

Se implementa busqueda full-text en PostgreSQL sobre:

- `items.title`
- `items.description`
- etiquetas asociadas (`tags.name` via `item_tags`)

## Migracion

`supabase/migrations/20260405_acrn45_full_text_search.sql`

Incluye:

1. Columna `items.search_vector` (`tsvector`).
2. Funcion `build_item_search_vector(...)`.
3. Triggers para mantener el vector al cambiar items, item_tags o nombre de tags.
4. Backfill inicial para items existentes.
5. Indice GIN en `items.search_vector`.
6. Funcion `search_items_full_text(...)` con `websearch_to_tsquery`.

## Ejemplo de consulta SQL

```sql
select *
from public.search_items_full_text(
  '00000000-0000-0000-0000-000000000000'::uuid,
  'openai productividad',
  20,
  0
);
```

## Notas

- Ranking por `ts_rank_cd`.
- Orden: mayor relevancia, luego `created_at` descendente.
- Configuracion FTS usada: `simple`.
