"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerRegister() {
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'Owner Register | PG & Room Rental';
    // Redirect to main register with owner role
    router.replace('/auth/register?role=owner');
  }, [router]);
  
  return null; // Component will redirect
}
