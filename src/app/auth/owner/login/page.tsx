"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerLogin() {
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'Owner Login | PG & Room Rental';
    // Redirect to main login with owner role
    router.replace('/auth/login?role=owner');
  }, [router]);
  
  return null; // Component will redirect
}
