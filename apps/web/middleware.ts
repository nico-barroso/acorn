import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATH_PREFIXES = ['/home', '/search', '/folders', '/profile']
const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/auth/reset-password']

function isPathInPrefixes(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in middleware environment.`)
  return value
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        get(name) {
          return request.cookies.get(name)?.value
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  if (pathname === '/callback') {
    return supabaseResponse
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const isProtectedPath = isPathInPrefixes(pathname, PROTECTED_PATH_PREFIXES)
  const isAuthPath = isPathInPrefixes(pathname, AUTH_PATH_PREFIXES)

  if (pathname === '/home') {
     console.log(`[MIDDLEWARE] /home request. User found? ${!!user}.`)
     if (error) {
       console.error(`[MIDDLEWARE] getUser() error:`, error.message, error.status, error.name)
     }
  }

  if (!user && isProtectedPath) {
    console.log(`[MIDDLEWARE] Redirecting ${pathname} to /login. No valid user.`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && isAuthPath) {
    console.log(`[MIDDLEWARE] Redirecting ${pathname} to /home. User is valid.`)
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)']
}
