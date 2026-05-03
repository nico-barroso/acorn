import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "DELETE,POST,OPTIONS",
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "DELETE" && req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse(500, { error: "Missing environment variables" });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse(401, { error: "Missing Authorization header" });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return jsonResponse(401, { error: "Unauthorized" });
  }

  const db = createClient(supabaseUrl, serviceRoleKey);
  const uid = user.id;

  // Delete in FK-safe order since there are no ON DELETE CASCADE constraints.
  // profiles.id = auth.users.id, so uid serves as both.

  // 1. item_tags (depends on items and tags)
  const { data: userItems } = await db.from("items").select("id").eq("user_id", uid);
  const itemIds = (userItems ?? []).map((r: { id: string }) => r.id);
  if (itemIds.length > 0) {
    await db.from("item_tags").delete().in("item_id", itemIds);
    await db.from("metadata").delete().in("item_id", itemIds);
    await db.from("files").delete().in("id", itemIds);
    await db.from("links").delete().in("id", itemIds);
  }

  // 2. items
  await db.from("items").delete().eq("user_id", uid);

  // 3. smart_folder_rules (depends on smart_folders)
  const { data: userFolders } = await db.from("smart_folders").select("id").eq("user_id", uid);
  const folderIds = (userFolders ?? []).map((r: { id: string }) => r.id);
  if (folderIds.length > 0) {
    await db.from("smart_folder_rules").delete().in("folder_id", folderIds);
  }

  // 4. smart_folders, tags
  await db.from("smart_folders").delete().eq("user_id", uid);
  await db.from("tags").delete().eq("user_id", uid);

  // 5. notifications (references auth.users directly)
  await db.from("notifications").delete().eq("user_id", uid);

  // 6. profiles (references auth.users)
  await db.from("profiles").delete().eq("id", uid);

  // 7. hard delete from auth
  const { error: deleteError } = await db.auth.admin.deleteUser(uid);
  if (deleteError) {
    console.error("[delete-account] error:", deleteError.message);
    return jsonResponse(500, { error: deleteError.message });
  }

  return jsonResponse(200, { success: true });
});
