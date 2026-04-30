# Acorn

Acorn is a personal content library — save links and files, tag them, organize them into smart folders, and find them later.

The project is split into two independent apps that share the same Supabase backend:

| App | Stack | Path |
|-----|-------|------|
| Mobile | Expo / React Native | `apps/mobile` |
| Web | Next.js 15 | `apps/web` |

Each app has its own `package.json` and `node_modules`. There is no monorepo tooling — install and run each app independently from its own directory.

## Backend

Both apps connect to the same [Supabase](https://supabase.com) project. The schema and migrations live in `supabase/migrations/`. Edge Functions (metadata extraction, link saving) live in `supabase/functions/`.

## Apps

See [`apps/README.md`](apps/README.md) for per-app setup and run instructions.

---

## Merge policy

### Automatic merges

The project supports automatic merges via the `auto-merge` label.

1. **Required CI**: every PR must pass the CI checks (lint + build) defined in `.github/workflows/ci.yml`.
2. **Required review**: at least one approval from a code owner (`.github/CODEOWNERS`) is required before the merge can complete.
3. **Auto-merge**: adding the `auto-merge` label triggers `.github/workflows/auto-merge.yml`, which enables squash auto-merge once all checks and approvals are satisfied.

> Without the `auto-merge` label the PR must be merged manually after approval.
