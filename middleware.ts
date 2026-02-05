import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role || 'user'

  // 1. Unauthenticated users protection
  const protectedRoutes = ['/dashboard', '/create', '/admin', '/plan', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated users redirection (Logged in users trying to access login/signup)
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/addons', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Admin Access Control (Admins shouldn't see user app)
  if (user && role === 'admin') {
    const userOnlyRoutes = ['/dashboard', '/create', '/plan', '/profile']
    if (userOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/admin/addons', request.url))
    }
  }

  // 4. User Access Control (Users shouldn't see admin)
  if (user && role !== 'admin') {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
