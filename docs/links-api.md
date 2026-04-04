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
