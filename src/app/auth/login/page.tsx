'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');

  useEffect(() => {
      // Set page title role wise
      if (role === 'owner') {
        document.title = 'Owner Login | PG & Room Rental';
      } else {
        document.title = 'User Login | PG & Room Rental';
      }
    
    // Redirect to role-specific page if no role parameter
    if (!role) {
      router.replace('/auth/login?role=user');
      return;
    }

    // Only allow 'user' and 'owner' roles, redirect admin to admin login
    if (role === 'admin') {
      router.replace('/auth/admin/login');
      return;
    }

    // Only allow valid roles
    if (role !== 'user' && role !== 'owner') {
      router.replace('/auth/login?role=user');
      return;
    }
  }, [role, router]);

  // Don't render anything during redirect
  if (!role || role === 'admin' || (role !== 'user' && role !== 'owner')) {
    return null;
  }

  return <LoginForm />;
}
