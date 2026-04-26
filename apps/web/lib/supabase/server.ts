import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing ${name}. Configure Supabase env vars in apps/web/.env.local for development and in deployment environment variables for production.`
    )
  }

  return value
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {}
        },
        remove(name, options) {
          try {
            cookieStore.delete(name, options)
          } catch (error) {}
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Expected in server components
          }
        }
      }
    }
  )
}
