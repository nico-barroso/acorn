-- ACRN-136
-- Hardening de vistas para respetar RLS del usuario invocador.

do $$
begin
  if exists (
    select 1
    from pg_views
    where schemaname = 'public'
      and viewname = 'items_with_links'
  ) then
    execute 'alter view public.items_with_links set (security_invoker = true)';
  end if;

  if exists (
    select 1
    from pg_views
    where schemaname = 'public'
      and viewname = 'smart_folders_with_rules'
  ) then
    execute 'alter view public.smart_folders_with_rules set (security_invoker = true)';
  end if;
end
$$;
