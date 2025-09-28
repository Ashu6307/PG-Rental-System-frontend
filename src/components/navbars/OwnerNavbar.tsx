'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { 
  FaUserTie, 
  FaBell, 
  FaCog, 
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaDollarSign,
  FaCalendar,
  FaTools,
  FaFileAlt,
  FaTachometerAlt
} from 'react-icons/fa';

// TypeScript interface for notifications
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const OwnerNavbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext) || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications for owner
  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock notifications - replace with API call
      setNotifications([
        { id: 1, title: 'New Booking Request', message: 'Room 101 booking request from John Doe', time: '30 mins ago', isRead: false },
        { id: 2, title: 'Payment Received', message: 'Monthly rent received from Room 205', time: '2 hours ago', isRead: false },
        { id: 3, title: 'Maintenance Request', message: 'Wi-Fi issue reported in Room 301', time: '4 hours ago', isRead: true },
        { id: 4, title: 'Review Posted', message: 'New 5-star review for your property', time: '1 day ago', isRead: true }
      ]);
      setUnreadCount(2);
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout?.();
    setIsProfileOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/owner" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaBuilding className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-white">Owner Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/owner/dashboard" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaTachometerAlt className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/owner/properties" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaBuilding className="w-4 h-4" />
              <span>Properties</span>
            </Link>
            <Link href="/owner/tenants" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaUsers className="w-4 h-4" />
              <span>Tenants</span>
            </Link>
            <Link href="/owner/bookings" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaCalendar className="w-4 h-4" />
              <span>Bookings</span>
            </Link>
            <Link href="/owner/finances" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaDollarSign className="w-4 h-4" />
              <span>Finances</span>
            </Link>
            <Link href="/owner/analytics" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors">
              <FaChartLine className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </div>

          {/* Right Side - User Menu */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-gray-300 hover:text-white transition-colors"
                  title="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link href="/owner/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaUserTie className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.businessName || user.ownerName || 'Owner'}</span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.businessName || user.ownerName}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-blue-600 font-medium">Property Owner</p>
                    </div>
                    
                    <Link href="/owner/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaUserTie className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    
                    <Link href="/owner/properties" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaBuilding className="w-4 h-4 mr-3" />
                      My Properties
                    </Link>
                    
                    <Link href="/owner/reports" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaFileAlt className="w-4 h-4 mr-3" />
                      Reports
                    </Link>
                    
                    <Link href="/owner/maintenance" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaTools className="w-4 h-4 mr-3" />
                      Maintenance
                    </Link>
                    
                    <Link href="/owner/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaCog className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <FaSignOutAlt className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              <Link href="/owner/dashboard" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                <FaTachometerAlt className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/owner/properties" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                <FaBuilding className="w-4 h-4" />
                <span>Properties</span>
              </Link>
              <Link href="/owner/tenants" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                <FaUsers className="w-4 h-4" />
                <span>Tenants</span>
              </Link>
              <Link href="/owner/bookings" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                <FaCalendar className="w-4 h-4" />
                <span>Bookings</span>
              </Link>
              <Link href="/owner/finances" className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors">
                <FaDollarSign className="w-4 h-4" />
                <span>Finances</span>
              </Link>
              
              {isAuthenticated && (
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                  <Link href="/owner/profile" className="block px-3 py-2 text-gray-300">
                    My Profile
                  </Link>
                  <Link href="/owner/settings" className="block px-3 py-2 text-gray-300">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default OwnerNavbar;
