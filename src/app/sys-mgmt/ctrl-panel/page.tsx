'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import RoleBasedLayout from '../../../layouts/RoleBasedLayout';

// Obfuscated admin dashboard with enhanced security
const SystemControlPanel = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('SystemControlPanel must be used within an AuthProvider');
  }
  const { isAuthenticated, role, loading } = authContext;
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [securityChecks, setSecurityChecks] = useState(false);

  useEffect(() => {
    // Enhanced security checks
    const performSecurityChecks = async () => {
      try {
        // Check if accessed from correct domain
        const currentHost = window.location.hostname;
        const allowedHosts = ['localhost', '127.0.0.1'];
        
        if (!allowedHosts.includes(currentHost) && !currentHost.includes('vercel')) {
          router.push('/');
          return;
        }

        // Check user agent for suspicious patterns
        const userAgent = navigator.userAgent;
        const suspiciousPatterns = [
          /bot/i, /crawler/i, /spider/i, /scraper/i, 
          /automated/i, /phantom/i, /headless/i
        ];
        
        if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
          router.push('/');
          return;
        }

        // Check for development tools (basic detection)
        let devtools = false;
        const threshold = 160;
        
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          devtools = true;
        }

        if (devtools) {
          console.warn('Development tools detected');
        }

        setSecurityChecks(true);
      } catch (error) {
        console.error('Security check failed:', error);
        router.push('/');
      }
    };

    performSecurityChecks();
  }, [router]);

  useEffect(() => {
    // Wait for both auth and security checks
    if (!loading && securityChecks) {
      if (!isAuthenticated) {
        router.push('/sys-mgmt/auth');
        return;
      }

      if (role !== 'admin' && role !== 'super_admin') {
        router.push('/sys-mgmt/auth');
        return;
      }

      // Admin authenticated and security checks passed
      setPageLoading(false);
    }
  }, [isAuthenticated, role, loading, securityChecks, router]);

  // Show loading while checks are running
  if (pageLoading || !securityChecks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-300 text-lg">Verifying Access Credentials...</p>
          <p className="text-gray-500 text-sm mt-2">Performing Security Validation</p>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedLayout role="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                System Control Panel
              </h1>
              <p className="text-xl text-red-100">
                Secure Administrative Interface
              </p>
              <div className="mt-4 text-sm text-red-200">
                Session: {new Date().toLocaleString()} | Access Level: Maximum
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Administrative Control Center
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Advanced system management interface is currently under development
              </p>
            </div>

            {/* Security Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">Security Validation: PASSED</span>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">User Management</h3>
                <p className="text-sm text-gray-600">Advanced user control and monitoring systems</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">System Analytics</h3>
                <p className="text-sm text-gray-600">Real-time platform performance monitoring</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Security Center</h3>
                <p className="text-sm text-gray-600">Enhanced security protocols and audit logs</p>
              </div>
            </div>

            <div className="text-gray-500">
              <p className="mb-2">🔧 Advanced administrative features coming soon</p>
              <p className="text-sm">This secure interface will provide comprehensive system control capabilities</p>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default SystemControlPanel;
