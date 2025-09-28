'use client';
import { useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import TabSessionManager from '@/utils/TabSessionManager';

interface TabSecurityGuardProps {
  children: React.ReactNode;
}

// Component to protect against URL copying across tabs
const TabSecurityGuard: React.FC<TabSecurityGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext) || {};
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check for public routes
    const publicRoutes = ['/', '/about', '/contact'];
    const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
    
    // IMPORTANT: Skip all checks while loading
    if (loading) return;
    
    if (publicRoutes.some(route => pathname === route) || 
        authRoutes.some(route => pathname.startsWith(route))) {
      return;
    }

    // Add a small delay to allow AuthContext to update after login
    const securityCheckTimer = setTimeout(() => {
      // For protected routes, check if this is a new tab
      const sessionManager = TabSessionManager.getInstance();
      
      if (sessionManager.isNewTab() && pathname.startsWith('/dashboard')) {
        // console.warn('Security: New tab detected accessing protected route');
        
        // Redirect to appropriate login based on path
        if (pathname.startsWith('/dashboard/owner') || pathname.startsWith('/owner')) {
          router.push('/auth/login?role=owner');
        } else if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin') || pathname.startsWith('/sys-mgmt')) {
          router.push('/sys-mgmt/auth');
        } else {
          router.push('/auth/login?role=user');
        }
        return;
      }

      // Additional check: if not authenticated but trying to access protected route
      // Only after AuthContext has had time to update
      if (!isAuthenticated && (pathname.startsWith('/dashboard') || pathname.startsWith('/user') || pathname.startsWith('/owner') || pathname.startsWith('/sys-mgmt/ctrl-panel'))) {
        // console.warn('Security: Unauthenticated access attempt to protected route');
        
        if (pathname.startsWith('/owner') || pathname.includes('owner')) {
          router.push('/auth/login?role=owner');
        } else if (pathname.startsWith('/sys-mgmt') || pathname.includes('admin')) {
          router.push('/sys-mgmt/auth');
        } else {
          router.push('/auth/login?role=user');
        }
      }
    }, 100); // Small delay to allow AuthContext to update

    return () => clearTimeout(securityCheckTimer);
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading while security checks are running
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying session security...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default TabSecurityGuard;
