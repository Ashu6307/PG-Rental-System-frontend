'use client';
import React from 'react';
import RoleBasedLayout from '@/layouts/RoleBasedLayout';

const AdminDashboard = () => {
  return (
    <RoleBasedLayout role="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                System Administration Panel
              </h1>
              <p className="text-xl text-red-100">
                Monitor, manage, and maintain the entire platform
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-red-700 mb-2">0</div>
                <div className="text-gray-600">Total Users</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-gray-600">Active Owners</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-gray-600">Total Properties</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-gray-600">Active Bookings</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-600">System Uptime</div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                    <svg className="w-12 h-12 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.586-2.414A2 2 0 0019 8.414V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2.414a2 2 0 00.586 1.414L8 12v4a2 2 0 002 2h4a2 2 0 002-2v-4l2.414-2.414z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Enterprise Admin Dashboard
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    A comprehensive system administration interface with advanced monitoring, 
                    analytics, and management capabilities is under development.
                  </p>
                </div>

                {/* Features Coming Soon */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">User Management</h3>
                      <p className="text-sm text-gray-600">Complete user lifecycle management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">System Analytics</h3>
                      <p className="text-sm text-gray-600">Real-time platform performance metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Security Monitoring</h3>
                      <p className="text-sm text-gray-600">Advanced threat detection and prevention</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Content Management</h3>
                      <p className="text-sm text-gray-600">Platform content and listing moderation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Financial Oversight</h3>
                      <p className="text-sm text-gray-600">Transaction monitoring and reporting</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Audit Logs</h3>
                      <p className="text-sm text-gray-600">Comprehensive system activity tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Notification System</h3>
                      <p className="text-sm text-gray-600">Platform-wide communication management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">API Management</h3>
                      <p className="text-sm text-gray-600">Rate limiting and API usage monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Backup & Recovery</h3>
                      <p className="text-sm text-gray-600">Data protection and disaster recovery</p>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Database Online</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">API Services Active</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Security Systems OK</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Access available admin tools and reports
                  </p>
                  <div className="space-x-4">
                    <a 
                      href="/admin/users" 
                      className="inline-block bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-colors font-medium"
                    >
                      User Management
                    </a>
                    <a 
                      href="/admin/analytics" 
                      className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      System Analytics
                    </a>
                    <a 
                      href="/admin/settings" 
                      className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      System Settings
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedLayout>
  );
};

export default AdminDashboard;
