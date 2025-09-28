'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '../../auth/components/AdminLoginForm';
// Security through obscurity - obfuscated admin login
export default function SystemAuthPage() {
  const router = useRouter();

  // Additional security check - verify referrer and user agent
  useEffect(() => {
    const checkAccess = () => {
      // Basic bot detection
      const userAgent = navigator.userAgent.toLowerCase();
      const suspiciousBots = ['bot', 'crawler', 'spider', 'scraper'];
      
      if (suspiciousBots.some(bot => userAgent.includes(bot))) {
        router.push('/');
        return;
      }

      // Check if accessed directly (no referrer from our domain)
      const referrer = document.referrer;
      const currentDomain = window.location.hostname;
      
      if (referrer && !referrer.includes(currentDomain)) {
        // External referrer - add delay to make it less attractive for bots
        setTimeout(() => {
          // Allow access but log suspicious activity
          console.warn('External referrer detected:', referrer);
        }, 2000);
      }
    };

    checkAccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 bg-red-900/10"></div>
      <div className="relative z-10">
        <AdminLoginForm />
      </div>
    </div>
  );
}
