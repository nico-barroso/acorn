# Auditoría Mobile — Estado final

## 🧪 Pendiente de testear (QA manual)

- **Reset password** (`app/_layout.tsx`, `ResetPassword.tsx`): flujo end-to-end con email real. Verificar `acorn://reset-password` en Supabase Redirect URLs, luego probar con dispositivo físico o `xcrun simctl openurl`.
- **Cambio de email** (`useEditProfile`): `supabase.auth.updateUser({ email })` requiere confirmación — verificar que llega el email y que el cambio se aplica.

---

## ✅ Resuelto

### 🔴 Crítico

- **Race condition en `lib/supabase.ts`** — `startAutoRefresh`/`stopAutoRefresh` serializados con promise chain.
- **Query keys inconsistentes en Search** — `search-count` y `search-domains` renombradas a `['search', 'count', ...]` / `['search', 'domains', ...]`. `ItemDetail` invalida `['search']` tras borrar. `queryKeys.search` (dead code) eliminado.

### 🟠 Alto

- **`mapResource` duplicado en 3 sitios** — centralizado en `src/lib/mappers.ts` (`mapResource`, `mapSearchResult`, `mapFolderResource`).
- **`createTagColorMap` duplicado en 4 sitios** — centralizado en `src/lib/mappers.ts`.
- **`console.log` con datos sensibles** — eliminados en `useEditProfile`, `UserProfile.tsx`, `ProfileScreen.tsx`.
- **Avatar no se actualizaba al volver del perfil** — `avatar_url` incluido en la query key para forzar refetch cuando cambia el path.
- **Toggle read no propagado** — `onToggleRead` con optimistic update añadido a Search y FolderDetail.
- **Tag picker no propagado** — `TagPickerModal` añadido a Search y FolderDetail.
- **`void` sin `.catch()`** — analizado; los casos relevantes son `invalidateQueries` (fire-and-forget por diseño) o tienen manejo de error interno. Sin riesgo real.

### 🟡 Medio

- **`sanitizeDisplayName` duplicada** — eliminada de `index.tsx`, se usa `formatDisplayName` de `src/utils/formatDisplayName.ts`.
- **Email regex débil** — creado `src/lib/validators.ts` con `isValidEmail`, usado en `useLogin` y `useRegister`.
- **`as any` en `useSearch.ts`** — domainOptions query usa `let q: any` al inicio; `buildQuery` es genérica `<T>` sin casts en los call sites.
- **Smart rules limitadas** — `applySmartRules` expandida para soportar `domain` (operadores de string), `tag`/`tag_name` (con slugificación), `is_read`/`status` y `created_at` (operadores de fecha). `FolderResource` añade `createdAt` ISO string.
- **FlatList sin optimizaciones** — añadidos `removeClippedSubviews`, `maxToRenderPerBatch={5}`, `updateCellsBatchingPeriod={50}`, `windowSize={7}` en `Home.tsx`.
- **TODO sin implementar en `ResetPassword.tsx`** — flujo completo implementado (deep link exchange, PASSWORD_RECOVERY routing, `updateUser` + `signOut`).

### 🔵 Bajo

- **Rate limiting en formularios de auth** — cooldown de 3s tras error en `useLogin`, `useRegister` y `usePasswordRecovery`.
- **`SaveLinkModal.tsx` demasiado grande** — ya dividido en `SaveLinkMode.tsx` y `SaveFileMode.tsx`; el modal solo orquesta animación y tab switcher.
- **Dead code** — eliminados `App.tsx` y `components/SignOut.tsx`.
- **UI bloqueada en `useSaveLinkFlow`** — `cancelDraft()` ya no bloquea; `rollbackDraftLink` verifica `response.ok`.
- **`Image.prefetch` sin catch** — envuelto en `.catch(() => undefined)`.
- **Favicon desaparecía durante carga** — favicon siempre visible como base, thumbnail encima.
- **`SaveLinkSheet` sin `onError` en ogImage** — añadido estado `previewOgImageError`.
- **`useEditProfile` con setState en render** — movido a `useEffect`.
