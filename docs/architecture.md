# Arquitectura y observabilidad

## RNF-08 Observabilidad (Edge Functions)

Para las Edge Functions se usan tres niveles de log, serializados en JSON para facilitar la lectura en Supabase Logs:

- `info`: eventos normales del flujo (`extract_metadata_started`, `extract_metadata_completed`).
- `warn`: degradaciones controladas y errores no bloqueantes (`invalid_json_body`, `missing_required_fields`, `link_domain_update_failed`, `extract_metadata_degraded`).
- `error`: fallos de ejecucion o extraccion (`extract_metadata_failed`, `extract_metadata_function_failed`).

Cada ejecucion incluye `requestId` para correlacion en el dashboard de logs.

## Degradacion controlada en extraccion de metadatos

Si la extraccion de metadatos falla, el flujo no bloquea el guardado del recurso:

1. La funcion registra el error con nivel `error`.
2. Se persiste igualmente una fila en `metadata` con datos minimos:
   - `item_id`
   - `resolved_url` (URL original)
   - `fetched_at` (timestamp)
   - `status = failed`
3. La respuesta HTTP se devuelve como exito tecnico con `degraded: true`.

Esto garantiza que un fallo puntual en scraping no impide conservar el enlace del usuario.

