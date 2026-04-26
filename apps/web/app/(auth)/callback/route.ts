import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextPath = requestUrl.searchParams.get('next') ?? '/home'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_code_missing', requestUrl.origin))
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth Exchange Failed in /callback route:', error.message)
    return NextResponse.redirect(new URL('/login?error=oauth_exchange_failed', requestUrl.origin))
  }

  console.log('[CALLBACK] Successfully exchanged code for session for user:', data?.session?.user?.email)

  const safeNextPath = nextPath.startsWith('/') ? nextPath : '/home'
  
  // Create response
  const response = NextResponse.redirect(new URL(safeNextPath, requestUrl.origin))
  
  // Workaround for Next.js sometimes not passing next/headers cookies to NextResponse.redirect
  const cookieStore = await cookies()
  cookieStore.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })

  return response
}
