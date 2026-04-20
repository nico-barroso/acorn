-- RF-03 + RNF-01/RNF-02
-- Storage bucket privado por usuario + RLS en storage.objects

-- 1) Crear bucket privado (idempotente)
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do update
set public = false;

-- 2) Configurar RLS/policies en storage.objects cuando el rol tenga permisos de owner.
-- En algunos entornos gestionados, el rol de migraciones no es owner de storage.objects.
do $$
begin
  execute 'alter table storage.objects enable row level security';

  execute 'drop policy if exists "user-files insert own" on storage.objects';
  execute 'drop policy if exists "user-files read own" on storage.objects';
  execute 'drop policy if exists "user-files delete own" on storage.objects';
  execute 'drop policy if exists "user-files update own" on storage.objects';

  execute $policy$
    create policy "user-files insert own"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'user-files'
      and owner = auth.uid()
      and (storage.foldername(name))[1] = auth.uid()::text
    )
  $policy$;

  execute $policy$
    create policy "user-files read own"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'user-files'
      and owner = auth.uid()
    )
  $policy$;

  execute $policy$
    create policy "user-files delete own"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'user-files'
      and owner = auth.uid()
    )
  $policy$;

  execute $policy$
    create policy "user-files update own"
    on storage.objects
    for update
    to authenticated
    using (
      bucket_id = 'user-files'
      and owner = auth.uid()
    )
    with check (
      bucket_id = 'user-files'
      and owner = auth.uid()
      and (storage.foldername(name))[1] = auth.uid()::text
    )
  $policy$;
exception
  when insufficient_privilege then
    raise notice 'Skipping storage.objects policy setup: insufficient privileges for current migration role.';
end
$$;
