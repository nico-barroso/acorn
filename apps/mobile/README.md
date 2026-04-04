# Acorn Mobile

## Setup

1. Copy `.env.example` to `.env`.
2. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. In Supabase Dashboard go to Auth > URL Configuration and add `acorn://auth/callback` to Redirect URLs.
4. Install dependencies with `npm install`.
5. Start with `npm run start`.

## Scripts

- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- `npm run typecheck`
- `npm run format`


Se inicializó el cliente móvil en apps/mobile con Expo + TypeScript.

Se configuró navegación base con Expo Router (app/_layout.tsx, app/index.tsx).

Se añadió configuración de entorno con dotenv + expo-constants en app.config.ts y .env.

Se integró cliente Supabase en lib/supabase/client.ts con variables EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY.

Se creó estructura base app/, components/, lib/, hooks/.

Se configuró ESLint + Prettier y scripts (lint, typecheck, format).

Validaciones ejecutadas: npm run lint, npm run typecheck, npm run format, npx expo config --type public (todo OK).
