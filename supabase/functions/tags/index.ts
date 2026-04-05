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

function parseColorHex(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const raw = value.trim();
  if (!raw) {
    return null;
  }

  const normalized = raw.startsWith("#") ? raw.toLowerCase() : `#${raw.toLowerCase()}`;
  const isValid = /^#[0-9a-f]{6}$/.test(normalized);

  return isValid ? normalized : null;
}

function getTagIdentifier(url: URL) {
  const id = url.searchParams.get("id");
  const slug = url.searchParams.get("slug");

  return {
    id: id?.trim() || null,
    slug: slug?.trim() || null,
  };
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

async function handleCreate(req: Request, context: AuthContext) {
  const body = await req.json();

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return jsonResponse(400, { error: "name is required" });
  }

  const slug = slugifyTag(name);
  if (!slug) {
    return jsonResponse(400, { error: "invalid tag name" });
  }

  const colorHex = parseColorHex(body.color_hex);
  if (body.color_hex !== undefined && colorHex === null) {
    return jsonResponse(400, { error: "color_hex must be a valid hex color (#RRGGBB)" });
  }

  const { error: upsertError } = await context.supabase
    .from("tags")
    .upsert(
      {
        user_id: context.userId,
        name,
        slug,
        color_hex: colorHex,
      },
      {
        onConflict: "user_id,slug",
      },
    );

  if (upsertError) {
    return jsonResponse(400, { error: toErrorMessage(upsertError) });
  }

  const { data: tag, error: readError } = await context.supabase
    .from("tags")
    .select("id,name,slug,color_hex,created_at")
    .eq("user_id", context.userId)
    .eq("slug", slug)
    .single();

  if (readError || !tag) {
    return jsonResponse(400, { error: toErrorMessage(readError ?? "Failed to read created tag") });
  }

  return jsonResponse(201, { data: tag });
}

async function handleDelete(req: Request, context: AuthContext) {
  const requestUrl = new URL(req.url);
  const { id, slug } = getTagIdentifier(requestUrl);

  if (!id && !slug) {
    return jsonResponse(400, { error: "id or slug is required" });
  }

  let query = context.supabase
    .from("tags")
    .select("id,name,slug")
    .eq("user_id", context.userId)
    .limit(1);

  query = id ? query.eq("id", id) : query.eq("slug", slug!);

  const { data: foundTags, error: findError } = await query;

  if (findError) {
    return jsonResponse(400, { error: toErrorMessage(findError) });
  }

  const tag = foundTags?.[0] ?? null;

  if (!tag) {
    return jsonResponse(404, { error: "Tag not found" });
  }

  const { error: unlinkError } = await context.supabase
    .from("item_tags")
    .delete()
    .eq("tag_id", tag.id);

  if (unlinkError) {
    return jsonResponse(400, { error: toErrorMessage(unlinkError) });
  }

  const { error: deleteError } = await context.supabase
    .from("tags")
    .delete()
    .eq("id", tag.id)
    .eq("user_id", context.userId);

  if (deleteError) {
    return jsonResponse(400, { error: toErrorMessage(deleteError) });
  }

  return jsonResponse(200, {
    success: true,
    data: {
      id: tag.id,
      slug: tag.slug,
      name: tag.name,
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

    if (req.method === "DELETE") {
      return await handleDelete(req, context);
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (error) {
    console.error("tags_function_error", toErrorMessage(error));
    return jsonResponse(500, { error: "Internal server error" });
  }
});
