import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextMiddleware, NextRequest} from "next/server";
import { NextResponse } from "next/server";

const locales = ['en', 'fr'];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const languages = new Negotiator({ headers: Object.fromEntries(request.headers) }).languages();
  const locales = ['en'];
  const defaultLocale = 'en';

  try {
    const localeMatch = match(languages, locales, defaultLocale);
    if (localeMatch) return localeMatch;
  } catch (e) {
    console.warn("Couldn't match locale", languages, "going to default", defaultLocale);
  }

  return defaultLocale;
}

export const middleware: NextMiddleware = (request) => {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
