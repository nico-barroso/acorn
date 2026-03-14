import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MetadataResult {
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  siteName?: string;
  resolvedUrl?: string;
  language?: string;
  readTimeMinutes?: number;
}

async function extractMetadata(url: string): Promise<MetadataResult> {
  const result: MetadataResult = {};

  try {
    // Fetch the URL with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Acorn-Bot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    result.resolvedUrl = response.url;

    // Extract meta tags using regex (faster than parsing full DOM)
    const getMetaContent = (pattern: RegExp): string | undefined => {
      const match = html.match(pattern);
      return match ? match[1].trim() : undefined;
    };

    // Open Graph / Twitter meta tags
    result.ogTitle = getMetaContent(/<meta\s+(?:property|name)=["'](?:og:title|twitter:title)["']\s+content=["']([^"']+)["']/i)
      || getMetaContent(/<title[^>]*>([^<]+)<\/title>/i);

    result.ogDescription = getMetaContent(/<meta\s+(?:property|name)=["'](?:og:description|twitter:description)["']\s+content=["']([^"']+)["']/i)
      || getMetaContent(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

    result.ogImageUrl = getMetaContent(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i);

    result.siteName = getMetaContent(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);

    result.language = getMetaContent(/<html\s+[^>]*lang=["']([^"']+)["']/i);

    // Try to extract YouTube video duration if applicable
    if (result.resolvedUrl?.includes("youtube.com") || result.resolvedUrl?.includes("youtu.be")) {
      const durationMatch = html.match(/"lengthSeconds"\s*:\s*"?(\d+)"?/);
      if (durationMatch) {
        result.readTimeMinutes = Math.ceil(parseInt(durationMatch[1]) / 60);
      }
    }

    // Estimate read time for articles (rough calculation)
    if (result.ogDescription && !result.readTimeMinutes) {
      const wordCount = result.ogDescription.split(/\s+/).length;
      result.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

  } catch (error) {
    console.error("Metadata extraction error:", error.message);
  }

  return result;
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { item_id, url, user_id } = await req.json();

    if (!item_id || !url) {
      return new Response(
        JSON.stringify({ error: "Missing item_id or url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract metadata
    const metadata = await extractMetadata(url);
    const domain = extractDomain(url);

    // Determine status based on whether we got any metadata
    const status = metadata.ogTitle || metadata.ogDescription ? "completed" : "failed";

    // Upsert metadata record
    const { error } = await supabase
      .from("metadata")
      .upsert({
        item_id,
        resolved_url: metadata.resolvedUrl || url,
        og_title: metadata.ogTitle || null,
        og_description: metadata.ogDescription || null,
        og_image_url: metadata.ogImageUrl || null,
        site_name: metadata.siteName || domain,
        language: metadata.language || null,
        read_time_minutes: metadata.readTimeMinutes || null,
        fetched_at: new Date().toISOString(),
        status,
      }, {
        onConflict: "item_id",
      });

    if (error) {
      throw error;
    }

    // Also update the link record with domain
    if (domain) {
      await supabase
        .from("links")
        .update({ domain })
        .eq("id", item_id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status,
        domain,
        title: metadata.ogTitle,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});