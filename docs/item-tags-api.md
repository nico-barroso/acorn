# API item-tags (Edge Function)

Endpoint base: `POST|DELETE /functions/v1/item-tags`

## Auth

All requests require:

- `Authorization: Bearer <access_token>`
- `apikey: <anon_key>`

## Assign tag to resource (ACRN-44)

`POST /functions/v1/item-tags`

Body example:

```json
{
  "item_id": "<item-uuid>",
  "tag_slug": "importante"
}
```

You can also use `tag_id` instead of `tag_slug`.
Expected response: `200` with `{ "success": true }`.

## Unassign tag from resource (ACRN-44)

`DELETE /functions/v1/item-tags?item_id=<item-uuid>&tag_slug=importante`

You can also use `tag_id`.
Expected response: `200` with `{ "success": true }`.

## Notes

- `item_id` can belong to link or file items.
- The function enforces ownership: both the item and the tag must belong to the authenticated user.
