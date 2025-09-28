'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { 
  FaCrown, 
  FaBell, 
  FaCog, 
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaBuilding,
  FaChartLine,
  FaShieldAlt,
  FaDatabase,
  FaFileAlt,
  FaTachometerAlt,
  FaUserTie,
  FaUser,
  FaExclamationTriangle
} from 'react-icons/fa';

// TypeScript interface for notifications
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'warning' | 'error' | 'success' | 'info';
}

const AdminNavbar = () => {
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

  // Fetch admin notifications
  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock notifications - replace with API call
      setNotifications([
        { id: 1, title: 'System Alert', message: 'High server load detected', time: '15 mins ago', isRead: false, type: 'warning' },
        { id: 2, title: 'New Owner Registration', message: 'New property owner awaiting approval', time: '1 hour ago', isRead: false, type: 'info' },
        { id: 3, title: 'Payment Issue', message: 'Payment gateway error reported', time: '2 hours ago', isRead: true, type: 'error' },
        { id: 4, title: 'User Report', message: 'Inappropriate content reported by user', time: '4 hours ago', isRead: true, type: 'warning' },
        { id: 5, title: 'Backup Complete', message: 'Daily database backup completed', time: '6 hours ago', isRead: true, type: 'success' }
      ]);
      setUnreadCount(2);
    }
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout?.();
    setIsProfileOpen(false);
    // Redirect to obfuscated admin login
    router.push('/sys-mgmt/auth');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <FaExclamationTriangle className="w-3 h-3 text-yellow-500" />;
      case 'error': return <FaExclamationTriangle className="w-3 h-3 text-red-500" />;
      case 'success': return <FaShieldAlt className="w-3 h-3 text-green-500" />;
      default: return <FaBell className="w-3 h-3 text-blue-500" />;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-red-900 to-red-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <FaCrown className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-white">Admin Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin/dashboard" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaTachometerAlt className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaUser className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link href="/admin/owners" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaUserTie className="w-4 h-4" />
              <span>Owners</span>
            </Link>
            <Link href="/admin/properties" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaBuilding className="w-4 h-4" />
              <span>Properties</span>
            </Link>
            <Link href="/admin/analytics" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaChartLine className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link href="/admin/system" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaDatabase className="w-4 h-4" />
              <span>System</span>
            </Link>
            <Link href="/admin/security" className="flex items-center space-x-1 text-red-200 hover:text-white font-medium transition-colors">
              <FaShieldAlt className="w-4 h-4" />
              <span>Security</span>
            </Link>
          </div>

          {/* Right Side - Admin Menu */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center space-x-4">
              
              {/* System Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-200">System Online</span>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-red-200 hover:text-white transition-colors"
                  title="Admin Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-red-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">System Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-red-50' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-2 flex-1">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link href="/admin/notifications" className="text-sm text-red-600 hover:text-red-800">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-red-200 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <FaCrown className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.name || 'Admin'}</span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-red-600 font-medium">System Administrator</p>
                    </div>
                    
                    <Link href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaCrown className="w-4 h-4 mr-3" />
                      Admin Profile
                    </Link>
                    
                    <Link href="/admin/system-health" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaDatabase className="w-4 h-4 mr-3" />
                      System Health
                    </Link>
                    
                    <Link href="/admin/audit-logs" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaFileAlt className="w-4 h-4 mr-3" />
                      Audit Logs
                    </Link>
                    
                    <Link href="/admin/security" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaShieldAlt className="w-4 h-4 mr-3" />
                      Security Center
                    </Link>
                    
                    <Link href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaCog className="w-4 h-4 mr-3" />
                      System Settings
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
              className="text-red-200 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-red-700 py-4">
            <div className="space-y-2">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 px-3 py-2 text-red-200 hover:text-white transition-colors">
                <FaTachometerAlt className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link href="/admin/users" className="flex items-center space-x-2 px-3 py-2 text-red-200 hover:text-white transition-colors">
                <FaUser className="w-4 h-4" />
                <span>Users</span>
              </Link>
              <Link href="/admin/owners" className="flex items-center space-x-2 px-3 py-2 text-red-200 hover:text-white transition-colors">
                <FaUserTie className="w-4 h-4" />
                <span>Owners</span>
              </Link>
              <Link href="/admin/properties" className="flex items-center space-x-2 px-3 py-2 text-red-200 hover:text-white transition-colors">
                <FaBuilding className="w-4 h-4" />
                <span>Properties</span>
              </Link>
              <Link href="/admin/system" className="flex items-center space-x-2 px-3 py-2 text-red-200 hover:text-white transition-colors">
                <FaDatabase className="w-4 h-4" />
                <span>System</span>
              </Link>
              
              {isAuthenticated && (
                <div className="border-t border-red-700 pt-4 mt-4 space-y-2">
                  <Link href="/admin/profile" className="block px-3 py-2 text-red-200">
                    Admin Profile
                  </Link>
                  <Link href="/admin/settings" className="block px-3 py-2 text-red-200">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-300"
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

export default AdminNavbar;
