import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';

const locales = ['ar', 'en'];
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: process.env.SITE_LOCALE_DEFAULT || 'ar',
});

export default async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL(`/${req.nextUrl.locale || 'ar'}/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
