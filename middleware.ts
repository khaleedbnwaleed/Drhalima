import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Middleware for authentication and authorization
 * Protects admin routes and enforces role-based access control
 */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/gallery',
    '/news',
    '/platform',
    '/vision',
    '/member',
    '/volunteer',
    '/supporter',
    '/login',
    '/admin/login',
    '/admin/setup',
    '/supporter-login',
    '/supporter-signup',
    '/api/admin/setup',
    '/api/auth/login',
    '/api/supporter/login',
    '/api/supporter/signup',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route requires admin access
  const adminRoutes = ['/admin', '/api/admin'];
  const requiresAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (requiresAdmin) {
    // Verify authentication token
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken');

    if (!token) {
      // Redirect to login if not authenticated
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verify token validity (basic check - in production use JWT verification)
    try {
      const user = JSON.parse(token.value);

      // Ensure user has admin role
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Forbidden - Admin access required' },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Log access for audit trail
      const auditLog = {
        userId: user.userId,
        action: 'page_access',
        resource: pathname,
        timestamp: new Date().toISOString(),
        ipAddress: request.ip,
        userAgent: request.headers.get('user-agent'),
      };

      // Store in logs (you can send to a logging service)
      console.log('Audit log:', auditLog);
    } catch (error) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent content type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Enforce HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'"
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
