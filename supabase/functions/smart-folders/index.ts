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

    return jsonResponse(200, {
      data: {
        ...folder,
        rules: rulesMap.get(String(folder.id)) ?? [],
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
