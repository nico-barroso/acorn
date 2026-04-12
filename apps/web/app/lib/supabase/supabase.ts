import { createClient } from '@supabase/supabase-js'

let browserClient: ReturnType<typeof createClient> | null = null

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing ${name}. Configure Supabase env vars in apps/web/.env.local for development and in deployment environment variables for production.`
    )
  }

  return value
}

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase browser client is only available on the client side.')
  }

  const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return browserClient
}
