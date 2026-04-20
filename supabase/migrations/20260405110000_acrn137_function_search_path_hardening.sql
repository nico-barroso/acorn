-- ACRN-137
-- Hardening: fijar search_path en funciones de public para eliminar
-- advertencias "Function Search Path Mutable" de Security Advisor.

do $$
declare
  fn record;
begin
  for fn in
    select
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as identity_args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prokind = 'f'
  loop
    execute format(
      'alter function %I.%I(%s) set search_path = public, auth, extensions, pg_temp',
      fn.schema_name,
      fn.function_name,
      fn.identity_args
    );
  end loop;
end
$$;
