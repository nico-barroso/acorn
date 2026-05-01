# Acorn



Acorn es una aplicación multiplataforma para la gestión centralizada de recursos digitales. Permite guardar enlaces y archivos, enriquecerlos con metadatos, organizarlos con etiquetas y carpetas inteligentes, y recuperarlos después mediante búsqueda y filtros.

## Problema que resuelve

Guardar contenido en internet es trivial; recuperarlo cuando realmente se necesita no lo es. Acorn nace para reducir ese problema de acumulación desorganizada de recursos digitales y transformar el almacenamiento pasivo en una gestión activa del contenido guardado.

## Propuesta de valor

- Guardado de enlaces y archivos
- Extracción automática de metadatos
- Búsqueda full-text y filtros
- Sistema de etiquetas
- Carpetas inteligentes basadas en reglas
- Cliente web y cliente móvil sobre backend compartido

## Arquitectura

- **Web:** Next.js 15
- **Móvil:** React Native + Expo
- **Backend:** Supabase
- **Base de datos:** PostgreSQL
- **Autenticación:** email/password + Google OAuth
- **Storage:** bucket privado para archivos de usuario
- **Lógica server-side:** Edge Functions

## Estructura del repositorio


apps/
  mobile/     Cliente móvil Expo / React Native
  web/        Cliente web Next.js
supabase/
  migrations/ Esquema y migraciones
  functions/  Edge Functions
.github/
  workflows/  Automatizaciones de CI
## Merge( PE)
## Requisitos previos
.-Node.js 20 o superior
.-npm
.-Proyecto de Supabase configurado
.-Variables de entorno para web y móvil

## Puesta en marcha
# Web
bash


cd apps/web
npm install
cp .env.example .env.local
npm run dev

# Variables necesarias:

env

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
## Móvil
bash

cd apps/mobile
npm install
cp .env.example .env
npm run start

# Variables necesarias:

env

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

## Demo

.-Demo web: <ENLACE_DEMO_WEB>
.-Vídeo de demo: <ENLACE_VIDEO_DEMO>
.-Diseño en Figma: <ENLACE_FIGMA>
.-Planificación en Linear: <ENLACE_LINEAR>

## Capturas
Añade aquí 3–5 capturas limpias: login, home, búsqueda, carpetas y perfil.

## Estado del proyecto
MVP funcional desarrollado como Proyecto Final de DAM.

## Autores
Débora Fernández Moraña
José Nicolás Barroso García
Jorge Espinoza Martínez

## Documentación relacionada
Memoria del proyecto
Research & Strategy
Anexos de wireframes y RFTP
