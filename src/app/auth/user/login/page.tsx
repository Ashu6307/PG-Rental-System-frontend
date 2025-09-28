"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserLogin() {
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'User Login | PG & Room Rental';
    // Redirect to main login with user role
    router.replace('/auth/login?role=user');
  }, [router]);
  
  return null; // Component will redirect
}
