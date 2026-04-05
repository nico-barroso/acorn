# API tags (Edge Function)

Endpoint base: `POST|DELETE /functions/v1/tags`

## Auth

All requests require:

- `Authorization: Bearer <access_token>`
- `apikey: <anon_key>`

## Create tag (ACR-43)

`POST /functions/v1/tags`

Body example:

```json
{
  "name": "importante",
  "color_hex": "#ff9900"
}
```

Expected response: `201` with created tag data (`id`, `name`, `slug`, `color_hex`).

## Delete tag (ACR-43)

- By id: `DELETE /functions/v1/tags?id=<uuid>`
- By slug: `DELETE /functions/v1/tags?slug=importante`

Expected response: `200` with `{ "success": true }`.
If tag does not exist for user, returns `404`.
