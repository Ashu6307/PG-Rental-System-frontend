'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useContext(AuthContext) || {};
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Wait for AuthContext to initialize
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login?role=owner');
        return;
      }

      if (role !== 'owner') {
        router.push('/auth/login?role=owner');
        return;
      }

      // User is authenticated as owner
      setPageLoading(false);
    }
  }, [isAuthenticated, role, loading, router]);

  // Show loading while AuthContext is initializing
  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (return null to prevent flash)
  if (!isAuthenticated || role !== 'owner') {
    return null;
  }

  return (
    <OwnerDashboard />
  );
}
