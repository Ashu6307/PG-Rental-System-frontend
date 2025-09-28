"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import TabSecurityGuard from "@/components/security/TabSecurityGuard";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                           pathname?.startsWith('/user/dashboard') || 
                           pathname?.startsWith('/owner/dashboard') || 
                           pathname?.startsWith('/admin/dashboard') ||
                           pathname?.startsWith('/sys-mgmt');
  const isLoginPage = pathname?.includes('/login');

  useEffect(() => {
    if (isAuthPage && isLoginPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthPage, isLoginPage]);

  // For dashboard pages, don't show public navbar/footer
  if (isDashboardPage) {
    return (
      <AuthProvider>
        <TabSecurityGuard>
          {children}
        </TabSecurityGuard>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <TabSecurityGuard>
        <Navbar />
        {children}
        {!isAuthPage && <Footer />}
      </TabSecurityGuard>
    </AuthProvider>
  );
}
