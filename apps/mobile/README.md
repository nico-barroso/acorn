# Mobile (Expo / React Native)

Cliente móvil de Acorn para iOS y Android. Permite guardar enlaces y archivos, etiquetarlos, organizarlos en carpetas inteligentes y editar sus detalles.

## Stack

- Expo ~54 con Expo Router (navegación basada en archivos)
- React Native 0.81 / React 19
- Supabase JS para autenticación, base de datos y storage
- TanStack Query para estado de servidor y caché
- React Native SVG para iconos personalizados

## Estructura

```
apps/mobile/
  app/               Rutas de Expo Router
  src/
    components/      Componentes UI compartidos
    screens/         Pantallas (Home, Search, FolderDetail, ItemDetail, …)
    lib/             Cliente de Supabase, query keys, utilidades
    hooks/           Hooks compartidos
    theme/           Tokens de color y tipografía
  hooks/             Hooks de feature (useUploadFile, useSaveFileFlow, …)
  assets/            Fuentes, imágenes y SVGs
```

## Configuración

1. Copia `.env.example` a `.env` y rellena las variables:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   ```

2. En el panel de Supabase, ve a **Auth → URL Configuration** y añade `acorn://auth/callback` a las **Redirect URLs**. Es necesario para que el flujo de OAuth (Google) pueda volver a la app vía deep link.

## Instalación

```bash
cd apps/mobile
npm install
```

## Scripts

```bash
npm run start       # Expo dev server (escanea el QR con Expo Go)
npm run ios         # Ejecuta en simulador iOS
npm run android     # Ejecuta en emulador Android
```
