-- Full-text search RPCs for mobile/web search
-- Replaces ilike-based filtering with search_vector @@ websearch_to_tsquery

CREATE OR REPLACE FUNCTION public.search_user_items_count(
  p_user_id       uuid,
  p_query         text        DEFAULT NULL,
  p_type          text        DEFAULT NULL,
  p_domain        text        DEFAULT NULL,
  p_created_after timestamptz DEFAULT NULL,
  p_is_read       boolean     DEFAULT NULL
)
RETURNS bigint
LANGUAGE sql STABLE SECURITY INVOKER
AS $$
  SELECT COUNT(*)::bigint
  FROM public.items i
  LEFT JOIN public.links l ON l.id = i.id
  WHERE
    i.user_id = p_user_id
    AND (
      p_query IS NULL OR trim(p_query) = ''
      OR i.search_vector @@ websearch_to_tsquery('simple', trim(p_query))
      OR l.domain ILIKE '%' || trim(p_query) || '%'
    )
    AND (p_type          IS NULL OR i.type      = p_type)
    AND (p_domain        IS NULL OR l.domain    = p_domain)
    AND (p_created_after IS NULL OR i.created_at >= p_created_after)
    AND (p_is_read       IS NULL OR i.is_read   = p_is_read);
$$;

CREATE OR REPLACE FUNCTION public.search_user_items(
  p_user_id       uuid,
  p_query         text        DEFAULT NULL,
  p_type          text        DEFAULT NULL,
  p_domain        text        DEFAULT NULL,
  p_created_after timestamptz DEFAULT NULL,
  p_is_read       boolean     DEFAULT NULL,
  p_limit         integer     DEFAULT 10,
  p_offset        integer     DEFAULT 0
)
RETURNS TABLE (
  id               uuid,
  type             text,
  title            text,
  description      text,
  domain           text,
  url              text,
  created_at       timestamptz,
  is_read          boolean,
  tags             text[],
  og_image_url     text,
  preview_image_url text,
  favicon_url      text,
  og_title         text
)
LANGUAGE sql STABLE SECURITY INVOKER
AS $$
  SELECT
    i.id,
    i.type,
    i.title,
    i.description,
    l.domain,
    l.url,
    i.created_at,
    i.is_read,
    ARRAY(
      SELECT t.name
      FROM public.item_tags it2
      JOIN public.tags t ON t.id = it2.tag_id
      WHERE it2.item_id = i.id
      ORDER BY t.name
    )                     AS tags,
    m.og_image_url,
    l.preview_image_url,
    l.favicon_url,
    m.og_title
  FROM public.items i
  LEFT JOIN public.links   l ON l.id       = i.id
  LEFT JOIN public.metadata m ON m.item_id = i.id
  WHERE
    i.user_id = p_user_id
    AND (
      p_query IS NULL OR trim(p_query) = ''
      OR i.search_vector @@ websearch_to_tsquery('simple', trim(p_query))
      OR l.domain ILIKE '%' || trim(p_query) || '%'
    )
    AND (p_type          IS NULL OR i.type      = p_type)
    AND (p_domain        IS NULL OR l.domain    = p_domain)
    AND (p_created_after IS NULL OR i.created_at >= p_created_after)
    AND (p_is_read       IS NULL OR i.is_read   = p_is_read)
  ORDER BY
    CASE
      WHEN p_query IS NOT NULL AND trim(p_query) != ''
      THEN ts_rank_cd(i.search_vector, websearch_to_tsquery('simple', trim(p_query)))
    END DESC NULLS LAST,
    i.created_at DESC
  LIMIT  greatest(p_limit,  1)
  OFFSET greatest(p_offset, 0);
$$;
