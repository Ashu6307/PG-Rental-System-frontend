'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  CreditCard, 
  Bell, 
  User, 
  BarChart3, 
  Heart,
  Search, 
  Settings, 
  Star, 
  Upload, 
  MessageCircle, 
  Activity, 
  TrendingUp, 
  PiggyBank, 
  Zap
} from 'lucide-react';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import RealTimeUpdates from '@/components/user-dashboard/RealTimeUpdates';
import RealTimeStatus from '@/components/user-dashboard/RealTimeStatus';
import WebSocketTester from '@/components/user-dashboard/WebSocketTester';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'favorites' | 'profile' | 'payments' | 'reviews'>('overview');

  return (
    <RoleBasedLayout role="user">
      <WebSocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <style jsx>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes morphBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
          }
          @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-slide-up { animation: slideInUp 0.8s ease-out; }
          .animate-morph-bg { 
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: morphBackground 8s ease infinite;
          }
          .animate-pulse-glow { animation: pulseGlow 2s infinite; }
          .animate-floating { animation: floating 6s ease-in-out infinite; }
          .glass-effect {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .card-hover {
            transition: all 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
        `}</style>
        
        {/* Header Section */}
        <div className="relative overflow-hidden animate-morph-bg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-white">
                    Welcome Back! 🏠
                  </h1>
                  <p className="mt-3 text-xl text-gray-300">
                    Manage your properties and bookings with style
                  </p>
                  {/* Real-time status */}
                  <div className="mt-4">
                    <RealTimeStatus showDetails={false} className="text-gray-300" />
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex space-x-4">
                  <button className="glass-effect px-6 py-3 rounded-xl text-white font-medium card-hover">
                    <Bell className="w-5 h-5 inline mr-2" />
                    Notifications
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl text-white font-medium animate-pulse-glow card-hover">
                    <Settings className="w-5 h-5 inline mr-2" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Bookings */}
            <div className="glass-effect rounded-2xl p-6 card-hover animate-floating">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Active Bookings</p>
                  <p className="text-3xl font-bold text-white">12</p>
                  <p className="text-green-400 text-sm flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15% from last month
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="glass-effect rounded-2xl p-6 card-hover animate-floating">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-white">₹45,280</p>
                  <p className="text-orange-400 text-sm flex items-center mt-2">
                    <PiggyBank className="w-4 h-4 mr-1" />
                    Last 6 months
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Favorite Properties */}
            <div className="glass-effect rounded-2xl p-6 card-hover animate-floating">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Saved Properties</p>
                  <p className="text-3xl font-bold text-white">28</p>
                  <p className="text-pink-400 text-sm flex items-center mt-2">
                    <Heart className="w-4 h-4 mr-1" />
                    Wishlist items
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-xl">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Reviews Given */}
            <div className="glass-effect rounded-2xl p-6 card-hover animate-floating">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Reviews Given</p>
                  <p className="text-3xl font-bold text-white">8</p>
                  <p className="text-yellow-400 text-sm flex items-center mt-2">
                    <Star className="w-4 h-4 mr-1" />
                    4.8 avg rating
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="glass-effect rounded-2xl p-2 animate-slide-up">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
                { id: 'bookings' as const, label: 'My Bookings', icon: Calendar },
                { id: 'favorites' as const, label: 'Saved Properties', icon: Heart },
                { id: 'profile' as const, label: 'Profile', icon: User },
                { id: 'payments' as const, label: 'Payments', icon: CreditCard },
                { id: 'reviews' as const, label: 'Reviews', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white animate-pulse-glow'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-slide-up">
              {/* Top Row - Real-time Updates and WebSocket Tester */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RealTimeUpdates />
                <WebSocketTester />
              </div>
              
              {/* Bottom Row - Recent Activity and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="glass-effect rounded-2xl p-6 card-hover">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-blue-400" />
                    Recent Activity
                  </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Booking confirmed', property: 'Luxury Villa, Goa', time: '2 hours ago' },
                    { action: 'Payment completed', property: 'Cozy Apartment, Mumbai', time: '1 day ago' },
                    { action: 'Review submitted', property: 'Beach House, Kerala', time: '3 days ago' },
                    { action: 'Property saved', property: 'Mountain Retreat, Himachal', time: '1 week ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.property}</p>
                      </div>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  ))}
                </div>
                </div>
                
                {/* Quick Actions */}
                <div className="glass-effect rounded-2xl p-6 card-hover">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Search Properties', icon: Search, color: 'from-blue-500 to-cyan-500' },
                      { label: 'My Bookings', icon: Calendar, color: 'from-purple-500 to-pink-500' },
                      { label: 'Upload Documents', icon: Upload, color: 'from-green-500 to-teal-500' },
                      { label: 'Contact Support', icon: MessageCircle, color: 'from-orange-500 to-red-500' }
                    ].map((action, index) => (
                      <button key={index} className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white font-medium card-hover`}>
                        <action.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="animate-slide-up">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-400" />
                  My Bookings
                </h3>
                <div className="grid gap-4">
                  {[
                    { property: 'Luxury Villa, Goa', dates: 'Dec 25 - Jan 2', status: 'Confirmed', amount: '₹45,000' },
                    { property: 'Beach Resort, Kerala', dates: 'Jan 15 - Jan 20', status: 'Pending', amount: '₹28,000' },
                    { property: 'Mountain Lodge, Himachal', dates: 'Feb 10 - Feb 15', status: 'Confirmed', amount: '₹35,000' }
                  ].map((booking, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 card-hover">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold">{booking.property}</h4>
                          <p className="text-gray-400">{booking.dates}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{booking.amount}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs ${booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-slide-up">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-green-400" />
                  Profile Settings
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="John Doe"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue="john@example.com"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Phone</label>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210"
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-xl text-white font-medium card-hover">
                        Upload Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </WebSocketProvider>
    </RoleBasedLayout>
  );
}