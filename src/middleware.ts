import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Middleware para todas as rotas
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar token (se o usuário está autenticado)
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Redirecionar usuários autenticados tentando acessar páginas de autenticação
  if (
    isAuthenticated &&
    pathname.startsWith('/auth') &&
    !pathname.includes('/logout')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verificar acesso a rotas protegidas (/dashboard)
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Verificar acesso a rotas protegidas (/admin)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    const userRole = token?.role
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// Configuração para especificar em quais rotas o middleware será executado
export const config = {
  matcher: [
    // Rotas protegidas
    '/dashboard/:path*',
    '/admin/:path*',

    // Rotas de autenticação (para redirecionar usuários já autenticados)
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',

    // Ignorar API routes de autenticação para evitar loops
    '/((?!api/auth).*)',
  ]
}
