import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'


import { NextMiddleware, NextRequest, NextResponse } from "next/server";
 
let locales = ['en', 'fr']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  let languages = new Negotiator({ headers: Object.fromEntries(request.headers) }).languages()
  let locales = ['en']
  let defaultLocale = 'en'
 
  return match(languages, locales, defaultLocale)
}
 
export const middleware: NextMiddleware = (request) => {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  console.log(request.headers.get('accept-language'));
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
}
