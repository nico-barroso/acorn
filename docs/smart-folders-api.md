# API smart-folders (Edge Function)

Endpoint base: `POST|GET|PATCH|DELETE /functions/v1/smart-folders`

## Auth

All requests require:

- `Authorization: Bearer <access_token>`
- `apikey: <anon_key>`

## Create folder (ACRN-48)

`POST /functions/v1/smart-folders`

Body example:

```json
{
  "name": "Sin leer de OpenAI",
  "description": "Recursos no vistos del dominio OpenAI",
  "is_active": true,
  "rules": [
    { "field": "domain", "operator": "equals", "value": "openai.com", "position": 0 },
    { "field": "is_read", "operator": "equals", "value": false, "position": 1 }
  ]
}
```

Expected response: `201` with created folder and `rules`.

## Read folders

- List: `GET /functions/v1/smart-folders`
- By id: `GET /functions/v1/smart-folders?id=<uuid>`

Expected response: `200` with folder(s) and nested `rules`.

## Update folder

`PATCH /functions/v1/smart-folders?id=<uuid>`

Body can include:

- `name`
- `description`
- `is_active`
- `rules` (if provided, existing rules are replaced)

Expected response: `200` with updated folder and `rules`.

## Delete folder

`DELETE /functions/v1/smart-folders?id=<uuid>`

Expected response: `200` with `{ "success": true }`.
Rules are deleted automatically by cascade.
