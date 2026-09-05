import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const language = request.headers.get('accept-language')?.toLowerCase().startsWith('zh')
    ? 'zh'
    : 'en'
  const localizedUrl = request.nextUrl.clone()
  localizedUrl.pathname = `/${language}${request.nextUrl.pathname}`

  return NextResponse.redirect(localizedUrl)
}

export const config = {
  matcher: ['/', '/blog', '/blog/:path*', '/friends'],
}
