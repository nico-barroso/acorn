import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
};

type JsonRecord = Record<string, unknown>;

type AuthContext = {
  supabase: ReturnType<typeof createClient>;
  userId: string;
};

type ListFilters = {
  domain: string | null;
  tagId: string | null;
  tagSlug: string | null;
  createdFrom: string | null;
  createdTo: string | null;
  isRead: boolean | null;
};

function jsonResponse(status: number, body: JsonRecord) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function parseTagNames(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  const unique = new Set<string>();

  for (const rawTag of tags) {
    if (typeof rawTag !== "string") {
      continue;
    }

    const name = rawTag.trim();
    if (!name) {
      continue;
    }

    unique.add(name);
  }

  return Array.from(unique);
}

function slugifyTag(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getLinkId(url: URL): string | null {
  const idFromQuery = url.searchParams.get("id");
  if (idFromQuery) {
    return idFromQuery;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const candidate = parts.at(-1);

  if (!candidate || candidate === "links") {
    return null;
  }

  return candidate;
}

function parsePagination(url: URL) {
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return { page, limit, from, to };
}

function parseBooleanParam(value: string | null): boolean | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "visto", "read"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "no-visto", "unread"].includes(normalized)) {
    return false;
  }

  return null;
}

function parseDateParam(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const asDate = new Date(normalized);
  if (Number.isNaN(asDate.getTime())) {
    return null;
  }

  return asDate.toISOString();
}

function parseListFilters(url: URL): ListFilters {
  const domainRaw = url.searchParams.get("domain")?.trim().toLowerCase() || null;
  const tagId = url.searchParams.get("tag_id")?.trim() || null;
  const tagSlug = url.searchParams.get("tag_slug")?.trim() || null;

  const createdFrom = parseDateParam(url.searchParams.get("created_from"));
  const createdTo = parseDateParam(url.searchParams.get("created_to"));
  const isRead = parseBooleanParam(url.searchParams.get("is_read"));

  return {
    domain: domainRaw,
    tagId,
    tagSlug,
    createdFrom,
    createdTo,
    isRead,
  };
}

function intersectIdSets(base: Set<string> | null, values: string[]): Set<string> {
  const incoming = new Set(values);

  if (base === null) {
    return incoming;
  }

  const result = new Set<string>();
  for (const id of base) {
    if (incoming.has(id)) {
      result.add(id);
    }
  }

  return result;
}

async function resolveFilteredItemIds(context: AuthContext, filters: ListFilters): Promise<Set<string> | null> {
  let idSet: Set<string> | null = null;

  if (filters.domain) {
    const { data: links, error } = await context.supabase
      .from("links")
      .select("id")
      .eq("domain", filters.domain);

    if (error) {
      throw error;
    }

    idSet = intersectIdSets(
      idSet,
      (links ?? []).map((row) => String(row.id)),
    );
  }

  if (filters.tagId || filters.tagSlug) {
    let tagIdToUse = filters.tagId;

    if (!tagIdToUse && filters.tagSlug) {
      const { data: tagRows, error: tagError } = await context.supabase
        .from("tags")
        .select("id")
        .eq("user_id", context.userId)
        .eq("slug", filters.tagSlug)
        .limit(1);

      if (tagError) {
        throw tagError;
      }

      tagIdToUse = tagRows?.[0]?.id ? String(tagRows[0].id) : null;
    }

    if (tagIdToUse) {
      const { data: itemTags, error: itemTagsError } = await context.supabase
        .from("item_tags")
        .select("item_id")
        .eq("tag_id", tagIdToUse);

      if (itemTagsError) {
        throw itemTagsError;
      }

      idSet = intersectIdSets(
        idSet,
        (itemTags ?? []).map((row) => String(row.item_id)),
      );
    } else {
      idSet = intersectIdSets(idSet, []);
    }
  }

  return idSet;
}

async function getAuthContext(req: Request): Promise<AuthContext> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Missing Authorization header");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return {
    supabase,
    userId: user.id,
  };
}

async function syncItemTags(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  itemId: string,
  tagNames: string[],
) {
  const normalizedTags = tagNames
    .map((name) => ({
      name,
      slug: slugifyTag(name),
    }))
    .filter((tag) => Boolean(tag.slug));

  const uniqueBySlug = new Map<string, string>();
  for (const tag of normalizedTags) {
    if (!uniqueBySlug.has(tag.slug)) {
      uniqueBySlug.set(tag.slug, tag.name);
    }
  }

  const tagsToPersist = Array.from(uniqueBySlug.entries()).map(([slug, name]) => ({
    user_id: userId,
    slug,
    name,
  }));

  const { error: clearError } = await supabase
    .from("item_tags")
    .delete()
    .eq("item_id", itemId);

  if (clearError) {
    throw clearError;
  }

  if (tagsToPersist.length === 0) {
    return [];
  }

  const { error: upsertTagsError } = await supabase
    .from("tags")
    .upsert(tagsToPersist, { onConflict: "user_id,slug" });

  if (upsertTagsError) {
    throw upsertTagsError;
  }

  const slugs = tagsToPersist.map((tag) => tag.slug);
  const { data: persistedTags, error: readTagsError } = await supabase
    .from("tags")
    .select("id,name,slug,color_hex")
    .eq("user_id", userId)
    .in("slug", slugs);

  if (readTagsError) {
    throw readTagsError;
  }

  if (!persistedTags || persistedTags.length === 0) {
    return [];
  }

  const linksToInsert = persistedTags.map((tag) => ({
    item_id: itemId,
    tag_id: tag.id,
  }));

  const { error: insertTagLinksError } = await supabase
    .from("item_tags")
    .insert(linksToInsert);

  if (insertTagLinksError) {
    throw insertTagLinksError;
  }

  return persistedTags.map((tag) => ({
    name: tag.name,
    slug: tag.slug,
    color_hex: tag.color_hex,
  }));
}

async function fetchTagsForItems(
  supabase: ReturnType<typeof createClient>,
  itemIds: string[],
) {
  if (itemIds.length === 0) {
    return new Map<string, Array<{ name: string; slug: string; color_hex: string | null }>>();
  }

  const { data, error } = await supabase
    .from("item_tags")
    .select("item_id,tags(name,slug,color_hex)")
    .in("item_id", itemIds);

  if (error) {
    throw error;
  }

  const tagsByItem = new Map<string, Array<{ name: string; slug: string; color_hex: string | null }>>();

  for (const row of data ?? []) {
    const current = tagsByItem.get(row.item_id) ?? [];
    const tagRelation = Array.isArray(row.tags) ? row.tags[0] : row.tags;

    if (tagRelation && typeof tagRelation === "object") {
      current.push({
        name: tagRelation.name,
        slug: tagRelation.slug,
        color_hex: tagRelation.color_hex,
      });
    }

    tagsByItem.set(row.item_id, current);
  }

  return tagsByItem;
}

function normalizeLinkPayload(item: Record<string, unknown>, tags: Array<{ name: string; slug: string; color_hex: string | null }>) {
  const linkRelation = Array.isArray(item.links) ? item.links[0] : item.links;
  const metadataRelation = Array.isArray(item.metadata) ? item.metadata[0] : item.metadata;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    is_read: item.is_read,
    is_favorite: item.is_favorite,
    visibility: item.visibility,
    created_at: item.created_at,
    updated_at: item.updated_at,
    url: linkRelation?.url ?? null,
    domain: linkRelation?.domain ?? null,
    favicon_url: linkRelation?.favicon_url ?? null,
    preview_image_url: linkRelation?.preview_image_url ?? null,
    metadata: metadataRelation ?? null,
    tags,
  };
}

async function handleCreate(req: Request, context: AuthContext) {
  const body = await req.json();
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!url) {
    return jsonResponse(400, { error: "url is required" });
  }

  const now = new Date().toISOString();
  const domain = extractDomain(url);

  const { data: item, error: itemError } = await context.supabase
    .from("items")
    .insert({
      user_id: context.userId,
      type: "link",
      title: typeof body.title === "string" ? body.title.trim() : null,
      description: typeof body.description === "string" ? body.description.trim() : null,
      is_read: typeof body.is_read === "boolean" ? body.is_read : false,
      is_favorite: typeof body.is_favorite === "boolean" ? body.is_favorite : false,
      visibility: typeof body.visibility === "string" ? body.visibility : "private",
      created_at: now,
      updated_at: now,
    })
    .select("id,title,description,is_read,is_favorite,visibility,created_at,updated_at")
    .single();

  if (itemError || !item) {
    return jsonResponse(400, { error: toErrorMessage(itemError ?? "Failed to create item") });
  }

  const { error: linkError } = await context.supabase
    .from("links")
    .insert({
      id: item.id,
      url,
      domain: domain || null,
    });

  if (linkError) {
    return jsonResponse(400, { error: toErrorMessage(linkError) });
  }

  const tagNames = parseTagNames(body.tags);
  const tags = await syncItemTags(context.supabase, context.userId, item.id, tagNames);

  return jsonResponse(201, {
    data: {
      ...item,
      url,
      domain: domain || null,
      metadata: null,
      tags,
    },
  });
}

async function handleRead(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const linkId = getLinkId(requestUrl);

  if (linkId) {
    const { data: item, error } = await context.supabase
      .from("items")
      .select(
        "id,title,description,is_read,is_favorite,visibility,created_at,updated_at,links(url,domain,favicon_url,preview_image_url),metadata(og_title,og_description,og_image_url,site_name,language,read_time_minutes,status,fetched_at)",
      )
      .eq("id", linkId)
      .eq("user_id", context.userId)
      .eq("type", "link")
      .maybeSingle();

    if (error) {
      return jsonResponse(400, { error: toErrorMessage(error) });
    }

    if (!item) {
      return jsonResponse(404, { error: "Link not found" });
    }

    const tagsByItem = await fetchTagsForItems(context.supabase, [linkId]);

    return jsonResponse(200, {
      data: normalizeLinkPayload(item, tagsByItem.get(linkId) ?? []),
    });
  }

  const { page, limit, from, to } = parsePagination(requestUrl);
  const filters = parseListFilters(requestUrl);

  let filteredItemIds: Set<string> | null = null;

  try {
    filteredItemIds = await resolveFilteredItemIds(context, filters);
  } catch (error) {
    return jsonResponse(400, { error: toErrorMessage(error) });
  }

  if (
    filteredItemIds !== null
    && filteredItemIds.size === 0
  ) {
    return jsonResponse(200, {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        has_next: false,
      },
      filters,
    });
  }

  let query = context.supabase
    .from("items")
    .select(
      "id,title,description,is_read,is_favorite,visibility,created_at,updated_at,links(url,domain,favicon_url,preview_image_url),metadata(og_title,og_description,og_image_url,site_name,language,read_time_minutes,status,fetched_at)",
      { count: "exact" },
    )
    .eq("user_id", context.userId)
    .eq("type", "link");

  if (filters.isRead !== null) {
    query = query.eq("is_read", filters.isRead);
  }

  if (filters.createdFrom) {
    query = query.gte("created_at", filters.createdFrom);
  }

  if (filters.createdTo) {
    query = query.lte("created_at", filters.createdTo);
  }

  if (filteredItemIds !== null) {
    query = query.in("id", Array.from(filteredItemIds));
  }

  const { data: items, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return jsonResponse(400, { error: toErrorMessage(error) });
  }

  const itemIds = (items ?? []).map((item) => String(item.id));
  const tagsByItem = await fetchTagsForItems(context.supabase, itemIds);

  const rows = (items ?? []).map((item) =>
    normalizeLinkPayload(item, tagsByItem.get(String(item.id)) ?? []),
  );

  return jsonResponse(200, {
    data: rows,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      has_next: (count ?? 0) > page * limit,
    },
    filters,
  });
}

async function handleUpdate(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const linkId = getLinkId(requestUrl);

  if (!linkId) {
    return jsonResponse(400, { error: "id is required" });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.title === "string") {
    updates.title = body.title.trim();
  }

  if (typeof body.description === "string") {
    updates.description = body.description.trim();
  }

  if (typeof body.is_read === "boolean") {
    updates.is_read = body.is_read;
  }

  const allowedUpdateKeys = Object.keys(updates).length;
  const hasTagsInput = Array.isArray(body.tags);

  if (allowedUpdateKeys <= 1 && !hasTagsInput) {
    return jsonResponse(400, { error: "No updatable fields provided" });
  }

  if (allowedUpdateKeys > 1) {
    const { error: updateError } = await context.supabase
      .from("items")
      .update(updates)
      .eq("id", linkId)
      .eq("user_id", context.userId)
      .eq("type", "link");

    if (updateError) {
      return jsonResponse(400, { error: toErrorMessage(updateError) });
    }
  }

  if (hasTagsInput) {
    const tags = parseTagNames(body.tags);
    await syncItemTags(context.supabase, context.userId, linkId, tags);
  }

  const { data: item, error } = await context.supabase
    .from("items")
    .select(
      "id,title,description,is_read,is_favorite,visibility,created_at,updated_at,links(url,domain,favicon_url,preview_image_url),metadata(og_title,og_description,og_image_url,site_name,language,read_time_minutes,status,fetched_at)",
    )
    .eq("id", linkId)
    .eq("user_id", context.userId)
    .eq("type", "link")
    .maybeSingle();

  if (error) {
    return jsonResponse(400, { error: toErrorMessage(error) });
  }

  if (!item) {
    return jsonResponse(404, { error: "Link not found" });
  }

  const tagsByItem = await fetchTagsForItems(context.supabase, [linkId]);

  return jsonResponse(200, {
    data: normalizeLinkPayload(item, tagsByItem.get(linkId) ?? []),
  });
}

async function handleDelete(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const linkId = getLinkId(requestUrl);

  if (!linkId) {
    return jsonResponse(400, { error: "id is required" });
  }

  const { data: item, error: checkError } = await context.supabase
    .from("items")
    .select("id")
    .eq("id", linkId)
    .eq("user_id", context.userId)
    .eq("type", "link")
    .maybeSingle();

  if (checkError) {
    return jsonResponse(400, { error: toErrorMessage(checkError) });
  }

  if (!item) {
    return jsonResponse(404, { error: "Link not found" });
  }

  const { error: deleteError } = await context.supabase
    .from("items")
    .delete()
    .eq("id", linkId)
    .eq("user_id", context.userId)
    .eq("type", "link");

  if (deleteError) {
    return jsonResponse(400, { error: toErrorMessage(deleteError) });
  }

  return jsonResponse(200, {
    success: true,
    message: "Link deleted",
    id: linkId,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let context: AuthContext;

  try {
    context = await getAuthContext(req);
  } catch (error) {
    return jsonResponse(401, { error: toErrorMessage(error) });
  }

  try {
    if (req.method === "POST") {
      return await handleCreate(req, context);
    }

    if (req.method === "GET") {
      return await handleRead(req, context);
    }

    if (req.method === "PATCH") {
      return await handleUpdate(req, context);
    }

    if (req.method === "DELETE") {
      return await handleDelete(req, context);
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("links_function_error", toErrorMessage(error));
    return jsonResponse(500, { error: "Internal server error" });
  }
});
