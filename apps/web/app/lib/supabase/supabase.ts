import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error(
      "Supabase browser client is only available on the client side.",
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase env vars. Configure them in apps/web/.env.local for development and in deployment environment variables for production.`,
    );
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Conectado a Supabase");
  }

  return browserClient;
}
