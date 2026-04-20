# Web (Next.js 15)

## Base structure

- `app/` App Router routes and features
- `components/` shared UI components (root-level)
- `lib/` app services and integrations (including Supabase SSR helpers)
- `hooks/` shared hooks (root-level)

## Supabase environment setup

This app expects the following public variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Development

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Fill in your Supabase development project values.

### Production

Set the same variables in your hosting provider environment settings (for example Vercel project environment variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not commit real `.env` files.

## Supabase clients

- Browser client (`@supabase/ssr`): `lib/supabase/client.ts`
- Server client (`@supabase/ssr`): `lib/supabase/server.ts`
