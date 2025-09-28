import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of restricted admin paths that should be blocked from public access
const RESTRICTED_ADMIN_PATHS = [
  '/admin',
  '/auth/admin',
];

// List of allowed secure admin paths (obfuscated)
const ALLOWED_ADMIN_PATHS = [
  '/sys-mgmt/auth',
  '/sys-mgmt/ctrl-panel',
];

export function adminSecurityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block access to old/obvious admin paths
  if (RESTRICTED_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    // Redirect to home page without revealing the existence of admin routes
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For secure admin paths, add additional security checks
  if (ALLOWED_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    // Check for suspicious user agents
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousBots = ['bot', 'crawler', 'spider', 'scraper', 'automated'];
    
    if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Add security headers for admin routes
    const response = NextResponse.next();
    
    // Prevent caching of admin pages
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Additional security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/admin/:path*',
    '/sys-mgmt/:path*',
  ],
};
