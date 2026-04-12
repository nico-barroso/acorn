# Web (Next.js)

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
