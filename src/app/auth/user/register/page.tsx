"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserRegister() {
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'User Register | PG & Room Rental';
    // Redirect to main register with user role
    router.replace('/auth/register?role=user');
  }, [router]);
  
  return null; // Component will redirect
}
