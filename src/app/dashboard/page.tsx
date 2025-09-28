'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and get their role
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      // Not logged in, redirect to login
      router.push('/auth/login?role=owner');
      return;
    }

    // Redirect based on user role
    if (userRole === 'owner') {
      router.push('/dashboard/owner');
    } else if (userRole === 'user') {
      router.push('/dashboard/user'); // Future user dashboard
    } else {
      // Default to owner dashboard for now
      router.push('/dashboard/owner');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
