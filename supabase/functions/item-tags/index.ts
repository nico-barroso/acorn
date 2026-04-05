import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST,DELETE,OPTIONS",
};

type JsonRecord = Record<string, unknown>;

type AuthContext = {
  supabase: ReturnType<typeof createClient>;
  userId: string;
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

async function resolveItemOwnership(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  itemId: string,
) {
  const { data: item, error } = await supabase
    .from("items")
    .select("id,type,user_id")
    .eq("id", itemId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return item;
}

async function resolveTag(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  tagId: string | null,
  tagSlug: string | null,
) {
  if (!tagId && !tagSlug) {
    return null;
  }

  let query = supabase
    .from("tags")
    .select("id,name,slug,color_hex")
    .eq("user_id", userId)
    .limit(1);

  query = tagId ? query.eq("id", tagId) : query.eq("slug", tagSlug!);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
}

function parseBody(body: unknown) {
  const payload = (body ?? {}) as Record<string, unknown>;

  const itemId = typeof payload.item_id === "string" ? payload.item_id.trim() : "";
  const tagId = typeof payload.tag_id === "string" ? payload.tag_id.trim() : "";
  const tagSlug = typeof payload.tag_slug === "string" ? payload.tag_slug.trim() : "";

  return {
    itemId,
    tagId: tagId || null,
    tagSlug: tagSlug || null,
  };
}

async function handleAssign(req: Request, context: AuthContext) {
  const body = await req.json();
  const { itemId, tagId, tagSlug } = parseBody(body);

  if (!itemId) {
    return jsonResponse(400, { error: "item_id is required" });
  }

  if (!tagId && !tagSlug) {
    return jsonResponse(400, { error: "tag_id or tag_slug is required" });
  }

  const item = await resolveItemOwnership(context.supabase, context.userId, itemId);
  if (!item) {
    return jsonResponse(404, { error: "Item not found" });
  }

  const tag = await resolveTag(context.supabase, context.userId, tagId, tagSlug);
  if (!tag) {
    return jsonResponse(404, { error: "Tag not found" });
  }

  const { error: assignError } = await context.supabase
    .from("item_tags")
    .upsert(
      {
        item_id: item.id,
        tag_id: tag.id,
      },
      {
        onConflict: "item_id,tag_id",
      },
    );

  if (assignError) {
    return jsonResponse(400, { error: toErrorMessage(assignError) });
  }

  return jsonResponse(200, {
    success: true,
    data: {
      item_id: item.id,
      item_type: item.type,
      tag,
    },
  });
}

async function handleUnassign(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const itemId = requestUrl.searchParams.get("item_id")?.trim() || "";
  const tagId = requestUrl.searchParams.get("tag_id")?.trim() || null;
  const tagSlug = requestUrl.searchParams.get("tag_slug")?.trim() || null;

  if (!itemId) {
    return jsonResponse(400, { error: "item_id is required" });
  }

  if (!tagId && !tagSlug) {
    return jsonResponse(400, { error: "tag_id or tag_slug is required" });
  }

  const item = await resolveItemOwnership(context.supabase, context.userId, itemId);
  if (!item) {
    return jsonResponse(404, { error: "Item not found" });
  }

  const tag = await resolveTag(context.supabase, context.userId, tagId, tagSlug);
  if (!tag) {
    return jsonResponse(404, { error: "Tag not found" });
  }

  const { error: deleteError } = await context.supabase
    .from("item_tags")
    .delete()
    .eq("item_id", item.id)
    .eq("tag_id", tag.id);

  if (deleteError) {
    return jsonResponse(400, { error: toErrorMessage(deleteError) });
  }

  return jsonResponse(200, {
    success: true,
    data: {
      item_id: item.id,
      item_type: item.type,
      tag_id: tag.id,
      tag_slug: tag.slug,
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
      return await handleAssign(req, context);
    }

    if (req.method === "DELETE") {
      return await handleUnassign(req, context);
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("item_tags_function_error", toErrorMessage(error));
    return jsonResponse(500, { error: "Internal server error" });
  }
});
