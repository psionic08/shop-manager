import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/signup' || path==='/api/users/login' || path==='/api/users/signup'
  const token = request.cookies.get('token')?.value
  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}
export const config = {
  matcher: [
    '/',
    '/api/:path*',
    '/buyer',
    '/item',
    '/bill',
    '/login',
    '/signup',
  ]
}