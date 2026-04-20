import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATH_PREFIXES = ['/home', '/search', '/folders', '/profile']
const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/auth/reset-password']

function isPathInPrefixes(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing ${name} in middleware environment.`)
  }

  return value
}

function withSupabaseCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value)
  })

  return target
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  })

  const supabase = createServerClient(
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl
  const isProtectedPath = isPathInPrefixes(pathname, PROTECTED_PATH_PREFIXES)
  const isAuthPath = isPathInPrefixes(pathname, AUTH_PATH_PREFIXES)

  if (!session && isProtectedPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)

    return withSupabaseCookies(response, NextResponse.redirect(loginUrl))
  }

  if (session && isAuthPath) {
    return withSupabaseCookies(response, NextResponse.redirect(new URL('/home', request.url)))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)']
}
