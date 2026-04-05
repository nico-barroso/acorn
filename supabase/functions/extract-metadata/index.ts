import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type LogLevel = "info" | "warn" | "error";

interface MetadataResult {
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  siteName?: string;
  resolvedUrl?: string;
  language?: string;
  readTimeMinutes?: number;
}

interface ExtractionOutcome {
  metadata: MetadataResult;
  extractionError?: string;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function log(level: LogLevel, event: string, details: Record<string, unknown>) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...details,
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

async function extractMetadata(url: string, requestId: string): Promise<ExtractionOutcome> {
  const result: MetadataResult = {};

  let timeout: number | undefined;

  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Acorn-Bot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    result.resolvedUrl = response.url;

    const getMetaContent = (pattern: RegExp): string | undefined => {
      const match = html.match(pattern);
      return match ? match[1].trim() : undefined;
    };

    result.ogTitle =
      getMetaContent(/<meta\s+(?:property|name)=["'](?:og:title|twitter:title)["']\s+content=["']([^"']+)["']/i) ||
      getMetaContent(/<title[^>]*>([^<]+)<\/title>/i);

    result.ogDescription =
      getMetaContent(/<meta\s+(?:property|name)=["'](?:og:description|twitter:description)["']\s+content=["']([^"']+)["']/i) ||
      getMetaContent(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

    result.ogImageUrl =
      getMetaContent(/<meta\s+(?:property|name)=["'](?:og:image|twitter:image)["']\s+content=["']([^"']+)["']/i);

    result.siteName =
      getMetaContent(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);

    result.language = getMetaContent(/<html\s+[^>]*lang=["']([^"']+)["']/i);

    if (result.resolvedUrl?.includes("youtube.com") || result.resolvedUrl?.includes("youtu.be")) {
      const durationMatch = html.match(/"lengthSeconds"\s*:\s*"?(\d+)"?/);
      if (durationMatch) {
        result.readTimeMinutes = Math.ceil(parseInt(durationMatch[1], 10) / 60);
      }
    }

    if (result.ogDescription && !result.readTimeMinutes) {
      const wordCount = result.ogDescription.split(/\s+/).length;
      result.readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    return { metadata: result };
  } catch (error) {
    const extractionError = toErrorMessage(error);

    log("error", "extract_metadata_failed", {
      requestId,
      url,
      error: extractionError,
    });

    return {
      metadata: result,
      extractionError,
    };
  } finally {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
  }
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
  const requestId = crypto.randomUUID();

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  log("info", "extract_metadata_started", {
    requestId,
    method: req.method,
  });

  try {
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch (error) {
      log("warn", "invalid_json_body", {
        requestId,
        error: toErrorMessage(error),
      });

      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const itemId = typeof body.item_id === "string" ? body.item_id : "";
    const url = typeof body.url === "string" ? body.url : "";

    if (!itemId || !url) {
      log("warn", "missing_required_fields", {
        requestId,
        hasItemId: Boolean(itemId),
        hasUrl: Boolean(url),
      });

      return new Response(
        JSON.stringify({ error: "Missing item_id or url" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { metadata, extractionError } = await extractMetadata(url, requestId);
    const domain = extractDomain(url);

    const status = metadata.ogTitle || metadata.ogDescription ? "completed" : "failed";

    const { error: metadataError } = await supabase
      .from("metadata")
      .upsert(
        {
          item_id: itemId,
          resolved_url: metadata.resolvedUrl || url,
          og_title: metadata.ogTitle || null,
          og_description: metadata.ogDescription || null,
          og_image_url: metadata.ogImageUrl || null,
          site_name: metadata.siteName || domain || null,
          language: metadata.language || null,
          read_time_minutes: metadata.readTimeMinutes || null,
          fetched_at: new Date().toISOString(),
          status,
        },
        {
          onConflict: "item_id",
        },
      );

    if (metadataError) {
      throw metadataError;
    }

    if (domain) {
      const { error: linkUpdateError } = await supabase
        .from("links")
        .update({ domain })
        .eq("id", itemId);

      if (linkUpdateError) {
        log("warn", "link_domain_update_failed", {
          requestId,
          itemId,
          domain,
          error: linkUpdateError.message,
        });
      }
    }

    if (extractionError) {
      log("warn", "extract_metadata_degraded", {
        requestId,
        itemId,
        url,
        fallbackStored: true,
      });
    }

    log("info", "extract_metadata_completed", {
      requestId,
      itemId,
      status,
      degraded: Boolean(extractionError),
    });

    return new Response(
      JSON.stringify({
        success: true,
        status,
        domain,
        title: metadata.ogTitle,
        degraded: Boolean(extractionError),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = toErrorMessage(error);

    log("error", "extract_metadata_function_failed", {
      requestId,
      error: errorMessage,
    });

    return new Response(
      JSON.stringify({ error: errorMessage, request_id: requestId }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
