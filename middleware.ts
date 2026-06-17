import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Şimdilik giriş, kayıt, şifre işlemleri ve panel sayfalarını gizle
  const blockedPaths = [
    '/giris',
    '/kayitol',
    '/sifremiunuttum',
    '/sifresifirlama',
    '/dogrulama',
    '/panel'
  ];

  if (blockedPaths.some(path => url.pathname.startsWith(path))) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/giris/:path*',
    '/kayitol/:path*',
    '/sifremiunuttum/:path*',
    '/sifresifirlama/:path*',
    '/dogrulama/:path*',
    '/panel/:path*'
  ],
}
