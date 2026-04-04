-- RF-03 + RNF-01/RNF-02
-- Storage bucket privado por usuario + RLS en storage.objects

-- 1) Crear bucket privado (idempotente)
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do update
set public = false;

-- 2) Asegurar RLS activo en objetos
alter table storage.objects enable row level security;

-- 3) Limpiar policies previas (idempotente)
drop policy if exists "user-files insert own" on storage.objects;
drop policy if exists "user-files read own" on storage.objects;
drop policy if exists "user-files delete own" on storage.objects;
drop policy if exists "user-files update own" on storage.objects;

-- 4) INSERT: solo en su carpeta (<uid>/...) y con owner = auth.uid()
create policy "user-files insert own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'user-files'
  and owner = auth.uid()
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 5) SELECT: solo sus objetos del bucket user-files
create policy "user-files read own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'user-files'
  and owner = auth.uid()
);

-- 6) DELETE: solo sus objetos del bucket user-files
create policy "user-files delete own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'user-files'
  and owner = auth.uid()
);

-- 7) UPDATE (opcional recomendado): solo sus objetos y misma carpeta de usuario
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
);
