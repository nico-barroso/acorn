import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextPath = requestUrl.searchParams.get('next') ?? '/home'

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_code_missing', requestUrl.origin))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=oauth_exchange_failed', requestUrl.origin))
  }

  const safeNextPath = nextPath.startsWith('/') ? nextPath : '/home'

  return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin))
}
