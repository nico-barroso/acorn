# Web (Next.js 15)

Cliente web de Acorn. Usa el mismo proyecto de Supabase y la misma autenticación que el cliente móvil.

## Stack

- Next.js 15 con App Router
- React 19
- Supabase SSR (`@supabase/ssr`) para cliente de navegador y servidor
- Tailwind CSS

## Estructura

```
apps/web/
  app/       Rutas y features (App Router)
  lib/       Servicios e integraciones
    supabase/  Clientes de Supabase (browser + server)
  hooks/     Hooks compartidos
  public/    Assets estáticos
```

Clientes de Supabase:

- Navegador: `lib/supabase/client.ts`
- Servidor: `lib/supabase/server.ts`

## Configuración

1. Copia `.env.example` a `.env.local`.
2. Rellena las variables con los valores de tu proyecto de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

En producción (por ejemplo Vercel), define las mismas variables en la configuración del proveedor. No subas archivos `.env` reales al repositorio.

## Instalación

```bash
cd apps/web
npm install
```

## Scripts

```bash
npm run dev         # Servidor de desarrollo en http://localhost:3000
npm run build       # Build de producción
npm run start       # Servidor de producción
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```
