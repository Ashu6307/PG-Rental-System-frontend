'use client';
import React from 'react';
import RoleBasedLayout from '@/layouts/RoleBasedLayout';

const OwnerDashboard = () => {
  return (
    <RoleBasedLayout role="owner">
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Owner Management Portal
              </h1>
              <p className="text-xl text-slate-100">
                Manage your properties, tenants, and business operations
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-slate-700 mb-2">0</div>
                <div className="text-gray-600">Total Properties</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <div className="text-gray-600">Active Tenants</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">₹0</div>
                <div className="text-gray-600">Monthly Revenue</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                <div className="text-gray-600">Occupancy Rate</div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v5" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Advanced Dashboard Coming Soon
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    We're building a comprehensive property management system with powerful analytics and automation tools.
                  </p>
                </div>

                {/* Features Coming Soon */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Property Management</h3>
                      <p className="text-sm text-gray-600">Add, edit, and manage all your properties</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Tenant Analytics</h3>
                      <p className="text-sm text-gray-600">Track tenant behavior and satisfaction</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Financial Reports</h3>
                      <p className="text-sm text-gray-600">Revenue tracking and expense management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Maintenance Tracking</h3>
                      <p className="text-sm text-gray-600">Schedule and track property maintenance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Smart Notifications</h3>
                      <p className="text-sm text-gray-600">Automated alerts and reminders</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Booking Management</h3>
                      <p className="text-sm text-gray-600">Handle tenant applications and bookings</p>
                    </div>
                  </div>
                </div>

                {/* Note about existing service */}
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Backend Services Ready</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    All dashboard APIs and services are already implemented and ready for integration!
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Get started by adding your first property
                  </p>
                  <div className="space-x-4">
                    <a 
                      href="/owner/properties" 
                      className="inline-block bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                      Manage Properties
                    </a>
                    <a 
                      href="/owner/analytics" 
                      className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      View Analytics
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

export default OwnerDashboard;
