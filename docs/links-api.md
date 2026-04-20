# API links (Edge Function)

Endpoint base: `POST|GET|PATCH|DELETE /functions/v1/links`

## Auth

All requests require:

- `Authorization: Bearer <access_token>`
- `apikey: <anon_key>`

## Create (ACRN-34)

`POST /functions/v1/links`

Body example:

```json
{
  "url": "https://openai.com",
  "title": "OpenAI",
  "description": "AI site",
  "tags": ["ia", "referencia"],
  "is_read": false
}
```

Expected response: `201` with `data.id`.

## Read/List (ACRN-35)

- List: `GET /functions/v1/links?page=1&limit=10`
- By id: `GET /functions/v1/links?id=<uuid>`
- Filters (combinable):
  - `domain=<domain>`
  - `tag_id=<uuid>` or `tag_slug=<slug>`
  - `created_from=<ISO date>`
  - `created_to=<ISO date>`
  - `is_read=true|false` (`visto/no-visto` also supported)

Example with combined filters:

`GET /functions/v1/links?page=1&limit=20&domain=openai.com&tag_slug=importante&created_from=2026-01-01&created_to=2026-12-31&is_read=false`

Expected response: `200` with `data` and `pagination` (for list).

## Update (ACRN-36)

`PATCH /functions/v1/links?id=<uuid>`

Body example:

```json
{
  "title": "OpenAI Updated",
  "description": "AI site updated",
  "is_read": true,
  "tags": ["ia", "producto"]
}
```

Expected response: `200` with updated `data`.

## Delete (ACRN-37)

`DELETE /functions/v1/links?id=<uuid>`

Expected response: `200` with `{ "success": true }`.
Subsequent `GET` by id should return `404`.
