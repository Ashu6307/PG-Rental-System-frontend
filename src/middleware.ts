import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Define types for better TypeScript support
type UserRole = 'user' | 'owner' | 'admin';

// Define route patterns for each role
const roleRoutes: Record<UserRole, string[]> = {
  user: ['/user', '/pg', '/rooms', '/bookings', '/favorites'],
  owner: ['/owner'],
  admin: ['/admin']
};

// Protected routes that require authentication (any role)
const protectedRoutes = ['/user/dashboard', '/dashboard/owner', '/admin/dashboard', '/test-auth', '/dashboards'];

// Public routes that don't require authentication
const publicRoutes = ['/', '/about', '/contact', '/auth', '/api/auth'];

// Auth routes that redirect if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

// Restricted admin paths that should be blocked
const RESTRICTED_ADMIN_PATHS = ['/admin', '/auth/admin'];

// Allowed secure admin paths (obfuscated)
const ALLOWED_ADMIN_PATHS = ['/sys-mgmt/auth', '/sys-mgmt/ctrl-panel'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || 
                request.cookies.get('authToken')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // ADMIN SECURITY: Block access to old/obvious admin paths
  if (RESTRICTED_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ADMIN SECURITY: Enhanced checks for secure admin paths
  if (ALLOWED_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousBots = ['bot', 'crawler', 'spider', 'scraper', 'automated'];
    
    if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Add security headers for admin routes
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    
    // Continue with normal auth checks for admin routes
    if (pathname.startsWith('/sys-mgmt/ctrl-panel')) {
      if (!token) {
        return NextResponse.redirect(new URL('/sys-mgmt/auth', request.url));
      }
      
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
        const { payload } = await jwtVerify(token, secret);
        
        if (payload.role !== 'admin') {
          return NextResponse.redirect(new URL('/sys-mgmt/auth', request.url));
        }
        
        return response;
      } catch {
        return NextResponse.redirect(new URL('/sys-mgmt/auth', request.url));
      }
    }
    
    return response;
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Handle API routes separately
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let user: any = null;
  let userRole: UserRole | null = null;

  // Verify token if present
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      const { payload } = await jwtVerify(token, secret);
      user = payload;
      userRole = payload.role as UserRole;
    } catch {
      console.error('Token verification failed');
      // Invalid token - clear it and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      response.cookies.delete('authToken');
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (user && userRole) {
      const dashboardUrl = getDashboardUrl(userRole);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = Object.values(roleRoutes).some(routes => 
    routes.some(route => pathname.startsWith(route))
  ) || protectedRoutes.some(route => pathname.startsWith(route));

  if (requiresAuth && !user) {
    // Store the attempted URL for redirect after login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for role-specific routes
  if (user && userRole) {
    const allowedRoutes = roleRoutes[userRole] || [];
    const isRoleSpecificRoute = Object.values(roleRoutes).some(routes => 
      routes.some(route => pathname.startsWith(route))
    );
    
    // For role-specific routes, check access
    if (isRoleSpecificRoute) {
      const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
      
      if (!hasAccess) {
        // Redirect to appropriate dashboard if accessing wrong role route
        const dashboardUrl = getDashboardUrl(userRole);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    }
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.id as string);
    response.headers.set('x-user-role', userRole || 'user');
    response.headers.set('x-user-email', user.email as string);
  }

  return response;
}

function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'owner':
      return '/owner/dashboard';
    case 'user':
    default:
      return '/user/dashboard';
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
