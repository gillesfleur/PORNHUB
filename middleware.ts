import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { rateLimit } from './src/lib/rate-limit'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret')

// Routes nécessitant une authentification (USER ou ADMIN)
const protectedApiRoutes = [
  '/api/auth/me',
  '/api/me',
  '/api/comments',
  '/api/videos', // Sera affiné plus bas pour POST/PUT/DELETE
]

// Routes nécessitant le rôle ADMIN
const adminApiRoutes = ['/api/admin']

// Pages frontend protégées
const protectedPages = ['/profile', '/favorites', '/history', '/playlists', '/settings']
const adminPages = ['/admin']

// Rate limiting configurations
const LIMITS = {
  LOGIN: { limit: 5, window: 900 }, // 5 / 15m
  REGISTER: { limit: 3, window: 3600 }, // 3 / 1h
  COMMENT: { limit: 10, window: 3600 }, // 10 / 1h (per user)
  REPORT: { limit: 5, window: 3600 }, // 5 / 1h (per IP)
  GENERAL: { limit: 100, window: 60 }, // 100 / 1m (per IP)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  const isApiRoute = pathname.startsWith('/api')

  // 1. CSRF Protection for mutations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    const isDev = process.env.NODE_ENV === 'development'

    if (origin) {
      const originUrl = new URL(origin)
      if (originUrl.host !== host && !(isDev && originUrl.hostname === 'localhost')) {
        return NextResponse.json({ success: false, error: 'CSRF Protection: Invalid Origin' }, { status: 403 })
      }
    }
  }

  // 1. Extraire le token (Header ou Cookie)
  const authHeader = request.headers.get('authorization')
  let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  
  // On accepte aussi le token via cookie pour les pages frontend
  if (!token) {
    token = request.cookies.get('accessToken')?.value || null
  }

  // 1.5 Rate Limiting (All API routes)
  if (isApiRoute) {
    let limitKey = `ip:${ip}:${pathname}`
    let limitConfig = LIMITS.GENERAL

    if (pathname === '/api/auth/login') limitConfig = LIMITS.LOGIN
    else if (pathname === '/api/auth/register') limitConfig = LIMITS.REGISTER
    else if (pathname.includes('/report')) limitConfig = LIMITS.REPORT
    else if (pathname.startsWith('/api/comments') && request.method === 'POST') {
      limitConfig = LIMITS.COMMENT
    }

    const { success, reset } = await rateLimit(limitKey, limitConfig.limit, limitConfig.window)

    if (!success) {
      return new NextResponse(
        JSON.stringify({ success: false, error: 'Trop de requêtes. Réessayez plus tard.' }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString() 
          } 
        }
      )
    }
  }

  // 2. Vérification si la route est protégée
  const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route))
  const isAdminApi = adminApiRoutes.some(route => pathname.startsWith(route))
  const isProtectedPage = protectedPages.some(page => pathname.startsWith(page))
  const isAdminPage = adminPages.some(page => pathname.startsWith(page))

  let needsAuth = isProtectedApi || isAdminApi || isProtectedPage || isAdminPage
  if (pathname.startsWith('/api/videos') && request.method !== 'GET') needsAuth = true

  if (!needsAuth) return handleSecurityHeaders(request, NextResponse.next())

  // 3. Valider le token pour les routes protégées
  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userRole = (payload as any).role

    // 4. Vérification du rôle ADMIN
    if (isAdminApi || isAdminPage) {
      if (userRole !== 'ADMIN') {
        if (isApiRoute) {
          return NextResponse.json({ success: false, error: 'Accès refusé. Admin requis.' }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // 5. Continuer avec les infos utilisateur dans les headers si besoin (optionnel)
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.sub as string)
    response.headers.set('x-user-role', userRole)
    
    return handleSecurityHeaders(request, response)
  } catch (error) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Token invalide ou expiré' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// 6. Security Headers & CORS (Inspiré par Next.js recommandés)
function handleSecurityHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin')
  const isAllowedOrigin = process.env.NODE_ENV === 'development' 
    ? origin?.includes('localhost') 
    : origin === process.env.NEXT_PUBLIC_SITE_URL

  if (isAllowedOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
