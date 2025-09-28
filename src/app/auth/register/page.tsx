'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');

  useEffect(() => {
      // Set page title role wise
      if (role === 'owner') {
        document.title = 'Owner Register | PG & Room Rental';
      } else {
        document.title = 'User Register | PG & Room Rental';
      }
    
    // Redirect to role-specific page if no role parameter
    if (!role) {
      router.replace('/auth/register?role=user');
      return;
    }

    // Only allow 'user' and 'owner' roles, redirect admin to admin register
    if (role === 'admin') {
      router.replace('/auth/admin/register');
      return;
    }

    // Only allow valid roles
    if (role !== 'user' && role !== 'owner') {
      router.replace('/auth/register?role=user');
      return;
    }
  }, [role, router]);

  // Don't render anything during redirect
  if (!role || role === 'admin' || (role !== 'user' && role !== 'owner')) {
    return null;
  }

  return <RegisterForm />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
