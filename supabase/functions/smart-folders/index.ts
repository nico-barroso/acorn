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

type ResourceCandidate = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  domain: string | null;
  url: string | null;
  tag_slugs: string[];
  tag_names: string[];
};

type RuleInput = {
  field: string;
  operator: string;
  value: unknown;
  valueType: string;
  position: number;
  orderIndex: number;
  isNegated: boolean;
};

function slugifyName(name: string): string {
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

  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;

    if (typeof e.message === "string" && e.message.trim()) {
      return e.message;
    }

    if (typeof e.error === "string" && e.error.trim()) {
      return e.error;
    }

    return JSON.stringify(error);
  }

  return String(error);
}

function getFolderId(url: URL): string | null {
  const idFromQuery = url.searchParams.get("id");
  if (idFromQuery) {
    return idFromQuery;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const candidate = parts.at(-1);

  if (!candidate || candidate === "smart-folders") {
    return null;
  }

  return candidate;
}

function parseBooleanLike(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
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

function parseDateIso(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    return null;
  }

  return asDate.toISOString();
}

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((entry) => typeof entry === "string")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const one = value.trim().toLowerCase();
    return one ? [one] : [];
  }

  return [];
}

function parseResourcesPagination(url: URL) {
  const page = Math.max(1, Number(url.searchParams.get("resources_page") || "1"));
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("resources_limit") || "50")));
  const from = (page - 1) * limit;
  const to = from + limit;

  return { page, limit, from, to };
}

function evaluateStringOperator(actualRaw: string | null, operatorRaw: string, expected: unknown): boolean {
  const actual = (actualRaw ?? "").toLowerCase();
  const operator = operatorRaw.toLowerCase();
  const expectedValues = parseStringArray(expected);
  const expectedOne = expectedValues[0] ?? "";

  if (operator === "equals") {
    return expectedValues.includes(actual);
  }

  if (operator === "not_equals") {
    return expectedValues.length > 0 && !expectedValues.includes(actual);
  }

  if (operator === "contains") {
    return Boolean(expectedOne) && actual.includes(expectedOne);
  }

  if (operator === "starts_with") {
    return Boolean(expectedOne) && actual.startsWith(expectedOne);
  }

  if (operator === "ends_with") {
    return Boolean(expectedOne) && actual.endsWith(expectedOne);
  }

  if (operator === "in") {
    return expectedValues.includes(actual);
  }

  if (operator === "not_in") {
    return expectedValues.length > 0 && !expectedValues.includes(actual);
  }

  return false;
}

function evaluateDateOperator(actualIso: string, operatorRaw: string, expected: unknown): boolean {
  const operator = operatorRaw.toLowerCase();
  const actualMs = new Date(actualIso).getTime();

  if (Number.isNaN(actualMs)) {
    return false;
  }

  const asObj = (expected && typeof expected === "object") ? expected as Record<string, unknown> : null;
  const fromIso = asObj ? parseDateIso(asObj.from) : null;
  const toIso = asObj ? parseDateIso(asObj.to) : null;

  const arrValues = Array.isArray(expected) ? expected : [];
  const betweenFrom = parseDateIso(arrValues[0]);
  const betweenTo = parseDateIso(arrValues[1]);

  const expectedIso = parseDateIso(expected);

  if (operator === "between") {
    const minIso = fromIso ?? betweenFrom;
    const maxIso = toIso ?? betweenTo;
    if (!minIso || !maxIso) {
      return false;
    }

    const minMs = new Date(minIso).getTime();
    const maxMs = new Date(maxIso).getTime();
    return actualMs >= minMs && actualMs <= maxMs;
  }

  if (!expectedIso) {
    return false;
  }

  const expectedMs = new Date(expectedIso).getTime();

  if (operator === "equals") {
    return actualMs === expectedMs;
  }

  if (operator === "gt") {
    return actualMs > expectedMs;
  }

  if (operator === "gte") {
    return actualMs >= expectedMs;
  }

  if (operator === "lt") {
    return actualMs < expectedMs;
  }

  if (operator === "lte") {
    return actualMs <= expectedMs;
  }

  return false;
}

function evaluateTagOperator(actualValues: string[], operatorRaw: string, expected: unknown): boolean {
  const operator = operatorRaw.toLowerCase();
  const expectedValues = parseStringArray(expected);

  if (expectedValues.length === 0) {
    return false;
  }

  if (operator === "equals" || operator === "contains" || operator === "in") {
    return expectedValues.some((value) => actualValues.includes(value));
  }

  if (operator === "all_in") {
    return expectedValues.every((value) => actualValues.includes(value));
  }

  if (operator === "not_equals" || operator === "not_contains" || operator === "not_in") {
    return expectedValues.every((value) => !actualValues.includes(value));
  }

  return false;
}

function evaluateRule(candidate: ResourceCandidate, rule: Record<string, unknown>): boolean {
  const field = typeof rule.field === "string" ? rule.field.toLowerCase() : "";
  const operator = typeof rule.operator === "string" ? rule.operator.toLowerCase() : "equals";
  const expected = rule.value;
  const isNegated = typeof rule.is_negated === "boolean" ? rule.is_negated : false;

  let result = false;

  if (field === "domain") {
    result = evaluateStringOperator(candidate.domain, operator, expected);
  } else if (field === "tag" || field === "tag_slug" || field === "tags") {
    result = evaluateTagOperator(candidate.tag_slugs, operator, expected);
  } else if (field === "tag_name") {
    result = evaluateTagOperator(candidate.tag_names, operator, expected);
  } else if (field === "is_read" || field === "status" || field === "visto") {
    const expectedBoolean = parseBooleanLike(expected);
    if (expectedBoolean !== null) {
      result = operator === "not_equals"
        ? candidate.is_read !== expectedBoolean
        : candidate.is_read === expectedBoolean;
    }
  } else if (field === "created_at" || field === "date") {
    result = evaluateDateOperator(candidate.created_at, operator, expected);
  }

  return isNegated ? !result : result;
}

function evaluateCandidate(
  candidate: ResourceCandidate,
  rules: Array<Record<string, unknown>>,
  logic: "ALL" | "ANY" = "ALL",
): boolean {
  if (rules.length === 0) {
    return true;
  }

  if (logic === "ANY") {
    return rules.some((rule) => evaluateRule(candidate, rule));
  }

  return rules.every((rule) => evaluateRule(candidate, rule));
}

async function fetchCandidateResources(
  context: AuthContext,
): Promise<ResourceCandidate[]> {
  const { data: items, error } = await context.supabase
    .from("items")
    .select("id,type,title,description,is_read,created_at,updated_at,links(url,domain)")
    .eq("user_id", context.userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const itemIds = (items ?? []).map((item) => String(item.id));

  const tagMap = new Map<string, { slugs: string[]; names: string[] }>();

  if (itemIds.length > 0) {
    const { data: itemTags, error: itemTagsError } = await context.supabase
      .from("item_tags")
      .select("item_id,tags(name,slug)")
      .in("item_id", itemIds);

    if (itemTagsError) {
      throw itemTagsError;
    }

    for (const row of itemTags ?? []) {
      const key = String(row.item_id);
      const current = tagMap.get(key) ?? { slugs: [], names: [] };
      const tagRel = Array.isArray(row.tags) ? row.tags[0] : row.tags;

      if (tagRel && typeof tagRel === "object") {
        const slug = typeof tagRel.slug === "string" ? tagRel.slug.toLowerCase() : "";
        const name = typeof tagRel.name === "string" ? tagRel.name.toLowerCase() : "";

        if (slug && !current.slugs.includes(slug)) {
          current.slugs.push(slug);
        }

        if (name && !current.names.includes(name)) {
          current.names.push(name);
        }
      }

      tagMap.set(key, current);
    }
  }

  return (items ?? []).map((item) => {
    const itemKey = String(item.id);
    const linkRel = Array.isArray(item.links) ? item.links[0] : item.links;
    const tags = tagMap.get(itemKey) ?? { slugs: [], names: [] };

    return {
      id: itemKey,
      type: typeof item.type === "string" ? item.type : "unknown",
      title: typeof item.title === "string" ? item.title : null,
      description: typeof item.description === "string" ? item.description : null,
      is_read: Boolean(item.is_read),
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
      domain: typeof linkRel?.domain === "string" ? linkRel.domain.toLowerCase() : null,
      url: typeof linkRel?.url === "string" ? linkRel.url : null,
      tag_slugs: tags.slugs,
      tag_names: tags.names,
    };
  });
}

function parseRules(input: unknown): RuleInput[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const rules: RuleInput[] = [];

  input.forEach((rawRule, index) => {
    const record = (rawRule ?? {}) as Record<string, unknown>;

    const field = typeof record.field === "string" ? record.field.trim() : "";
    const operator = typeof record.operator === "string" ? record.operator.trim() : "";

    if (!field || !operator || record.value === undefined) {
      return;
    }

    const valueType = typeof record.value_type === "string" && record.value_type.trim()
      ? record.value_type.trim()
      : Array.isArray(record.value)
        ? "array"
        : record.value === null
          ? "null"
          : typeof record.value;

    const position = typeof record.position === "number" && Number.isFinite(record.position)
      ? Math.max(0, Math.floor(record.position))
      : index;

    const orderIndex = typeof record.order_index === "number" && Number.isFinite(record.order_index)
      ? Math.max(0, Math.floor(record.order_index))
      : position;

    const isNegated = typeof record.is_negated === "boolean"
      ? record.is_negated
      : false;

    rules.push({
      field,
      operator,
      value: record.value,
      valueType,
      position,
      orderIndex,
      isNegated,
    });
  });

  return rules;
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

async function fetchRulesForFolders(
  supabase: ReturnType<typeof createClient>,
  folderIds: string[],
) {
  if (folderIds.length === 0) {
    return new Map<string, Array<Record<string, unknown>>>();
  }

  const { data, error } = await supabase
    .from("smart_folder_rules")
    .select("id,folder_id,field,operator,value_type,value,position,order_index,is_negated,created_at,updated_at")
    .in("folder_id", folderIds)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const byFolder = new Map<string, Array<Record<string, unknown>>>();

  for (const row of data ?? []) {
    const key = String(row.folder_id);
    const current = byFolder.get(key) ?? [];

    current.push({
      id: row.id,
      field: row.field,
      operator: row.operator,
      value_type: row.value_type,
      value: row.value,
      position: row.position,
      order_index: row.order_index,
      is_negated: row.is_negated,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });

    byFolder.set(key, current);
  }

  return byFolder;
}

async function replaceFolderRules(
  supabase: ReturnType<typeof createClient>,
  folderId: string,
  rules: RuleInput[],
) {
  const { error: clearError } = await supabase
    .from("smart_folder_rules")
    .delete()
    .eq("folder_id", folderId);

  if (clearError) {
    throw clearError;
  }

  if (rules.length === 0) {
    return;
  }

  const payload = rules.map((rule) => ({
    folder_id: folderId,
    field: rule.field,
    operator: rule.operator,
    value_type: rule.valueType,
    value: rule.value,
    position: rule.position,
    order_index: rule.orderIndex,
    is_negated: rule.isNegated,
  }));

  const { error: insertError } = await supabase
    .from("smart_folder_rules")
    .insert(payload);

  if (insertError) {
    throw insertError;
  }
}

async function handleCreate(req: Request, context: AuthContext) {
  const body = (await req.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return jsonResponse(400, { error: "name is required" });
  }

  const description = typeof body.description === "string"
    ? body.description.trim()
    : null;

  const slug = slugifyName(name);
  if (!slug) {
    return jsonResponse(400, { error: "invalid folder name" });
  }

  const isActive = typeof body.is_active === "boolean"
    ? body.is_active
    : true;

  const rules = parseRules(body.rules);

  const { data: folder, error: folderError } = await context.supabase
    .from("smart_folders")
    .insert({
      user_id: context.userId,
      name,
      slug,
      description,
      is_active: isActive,
    })
    .select("id,user_id,name,slug,description,is_active,created_at,updated_at")
    .single();

  if (folderError || !folder) {
    return jsonResponse(400, { error: toErrorMessage(folderError ?? "Failed to create folder") });
  }

  await replaceFolderRules(context.supabase, String(folder.id), rules);

  const rulesMap = await fetchRulesForFolders(context.supabase, [String(folder.id)]);

  return jsonResponse(201, {
    data: {
      ...folder,
      rules: rulesMap.get(String(folder.id)) ?? [],
    },
  });
}

async function handleRead(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const folderId = getFolderId(requestUrl);

  if (folderId) {
    const { data: folder, error } = await context.supabase
      .from("smart_folders")
      .select("id,user_id,name,slug,description,is_active,created_at,updated_at")
      .eq("id", folderId)
      .eq("user_id", context.userId)
      .maybeSingle();

    if (error) {
      return jsonResponse(400, { error: toErrorMessage(error) });
    }

    if (!folder) {
      return jsonResponse(404, { error: "Smart folder not found" });
    }

    const rulesMap = await fetchRulesForFolders(context.supabase, [String(folder.id)]);
    const rules = rulesMap.get(String(folder.id)) ?? [];

    const includeResources = requestUrl.searchParams.get("include_resources")?.toLowerCase() === "true"
      || requestUrl.searchParams.get("evaluate")?.toLowerCase() === "true";

    if (includeResources) {
      const logicParam = requestUrl.searchParams.get("logic")?.toUpperCase();
      const logic = logicParam === "ANY" ? "ANY" : "ALL";

      const resourcesPagination = parseResourcesPagination(requestUrl);
      const candidates = await fetchCandidateResources(context);
      const matched = candidates.filter((candidate) => evaluateCandidate(candidate, rules, logic));
      const paginated = matched.slice(resourcesPagination.from, resourcesPagination.to);

      return jsonResponse(200, {
        data: {
          ...folder,
          rules,
          resources: paginated,
          resources_pagination: {
            page: resourcesPagination.page,
            limit: resourcesPagination.limit,
            total: matched.length,
            has_next: matched.length > resourcesPagination.page * resourcesPagination.limit,
          },
          evaluation: {
            logic,
            matched_count: matched.length,
          },
        },
      });
    }

    return jsonResponse(200, {
      data: {
        ...folder,
        rules,
      },
    });
  }

  const { data: folders, error } = await context.supabase
    .from("smart_folders")
    .select("id,user_id,name,slug,description,is_active,created_at,updated_at")
    .eq("user_id", context.userId)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse(400, { error: toErrorMessage(error) });
  }

  const folderIds = (folders ?? []).map((folder) => String(folder.id));
  const rulesMap = await fetchRulesForFolders(context.supabase, folderIds);

  return jsonResponse(200, {
    data: (folders ?? []).map((folder) => ({
      ...folder,
      rules: rulesMap.get(String(folder.id)) ?? [],
    })),
  });
}

async function handleUpdate(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const folderId = getFolderId(requestUrl);

  if (!folderId) {
    return jsonResponse(400, { error: "id is required" });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const nextName = body.name.trim();
    updates.name = nextName;
    const nextSlug = slugifyName(nextName);
    if (!nextSlug) {
      return jsonResponse(400, { error: "invalid folder name" });
    }
    updates.slug = nextSlug;
  }

  if (typeof body.description === "string" || body.description === null) {
    updates.description = typeof body.description === "string"
      ? body.description.trim()
      : null;
  }

  if (typeof body.is_active === "boolean") {
    updates.is_active = body.is_active;
  }

  const shouldReplaceRules = body.rules !== undefined;
  const parsedRules = shouldReplaceRules ? parseRules(body.rules) : [];

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await context.supabase
      .from("smart_folders")
      .update(updates)
      .eq("id", folderId)
      .eq("user_id", context.userId);

    if (updateError) {
      return jsonResponse(400, { error: toErrorMessage(updateError) });
    }
  }

  if (shouldReplaceRules) {
    await replaceFolderRules(context.supabase, folderId, parsedRules);
  }

  const { data: folder, error } = await context.supabase
    .from("smart_folders")
    .select("id,user_id,name,slug,description,is_active,created_at,updated_at")
    .eq("id", folderId)
    .eq("user_id", context.userId)
    .maybeSingle();

  if (error) {
    return jsonResponse(400, { error: toErrorMessage(error) });
  }

  if (!folder) {
    return jsonResponse(404, { error: "Smart folder not found" });
  }

  const rulesMap = await fetchRulesForFolders(context.supabase, [String(folder.id)]);

  return jsonResponse(200, {
    data: {
      ...folder,
      rules: rulesMap.get(String(folder.id)) ?? [],
    },
  });
}

async function handleDelete(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const folderId = getFolderId(requestUrl);

  if (!folderId) {
    return jsonResponse(400, { error: "id is required" });
  }

  const { data: folder, error: readError } = await context.supabase
    .from("smart_folders")
    .select("id,name")
    .eq("id", folderId)
    .eq("user_id", context.userId)
    .maybeSingle();

  if (readError) {
    return jsonResponse(400, { error: toErrorMessage(readError) });
  }

  if (!folder) {
    return jsonResponse(404, { error: "Smart folder not found" });
  }

  const { error: deleteError } = await context.supabase
    .from("smart_folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", context.userId);

  if (deleteError) {
    return jsonResponse(400, { error: toErrorMessage(deleteError) });
  }

  return jsonResponse(200, {
    success: true,
    data: {
      id: folder.id,
      name: folder.name,
    },
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
    console.error("smart_folders_function_error", toErrorMessage(error));
    return jsonResponse(500, { error: "Internal server error" });
  }
});
