# Apps

Two independent applications sharing the same Supabase backend. Each is a self-contained project — no shared build tooling between them.

---

## `mobile` — Expo / React Native

Personal content library for iOS and Android. Users save links and files, tag them, organize them into smart folders, and open the detail view to edit notes.

**Stack**

- [Expo](https://expo.dev) ~54 with Expo Router (file-based navigation)
- React Native
- Supabase JS client for auth, database, and storage
- TanStack Query for server state and caching
- React Native SVG for custom icons

**Key directories**

```
apps/mobile/
  app/               Expo Router routes
  src/
    components/      Shared UI components (ContentCard, Tag, TagPickerModal, …)
    screens/         Screen-level components (Home, Search, FolderDetail, ItemDetail, …)
    lib/             Supabase client, query keys, shared utilities
    hooks/           Shared hooks
    theme/           Colors and typography tokens
  assets/            Fonts, images, SVG icons
  hooks/             Feature hooks (useUploadFile, useSaveFileFlow, …)
```

**Setup**

```bash
cd apps/mobile
npm install
```

Create a `.env` file at `apps/mobile/.env`:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

**Run**

```bash
npm start          # Expo dev server (scan QR with Expo Go)
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
```

**Type check**

```bash
npm run typecheck
```

---

## `web` — Next.js 15

Web counterpart for Acorn. Shares the same Supabase project and authentication as the mobile app.

**Stack**

- [Next.js](https://nextjs.org) 15 with App Router
- React 19
- Supabase SSR client (`@supabase/ssr`) for server and browser
- Tailwind CSS

**Key directories**

```
apps/web/
  app/       App Router routes and features
  lib/       Supabase clients (browser + server)
  hooks/     Shared hooks
```

**Setup**

```bash
cd apps/web
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Run**

```bash
npm run dev       # Development server on http://localhost:3000
npm run build     # Production build
npm run start     # Start production server
```

**Type check**

```bash
npm run typecheck
```
