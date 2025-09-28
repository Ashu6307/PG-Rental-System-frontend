'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useOwnerData } from '@/hooks/useOwnerData';
import { 
  Building2, 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  IndianRupee,
  Users,
  MessageSquare,
  Moon,
  Sun,
  Menu,
  Plus,
  BarChart3,
  FileText,
  HelpCircle
} from 'lucide-react';

interface OwnerNavbarProps {
  onMenuToggle: () => void;
  activeSection: string;
}

const OwnerNavbar: React.FC<OwnerNavbarProps> = ({ 
  onMenuToggle, 
  activeSection
}) => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext) || {};
  const { 
    ownerData, 
    ownerName, 
    primaryPropertyName, 
    unreadNotificationsCount,
    markNotificationAsRead 
  } = useOwnerData();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Refs for dropdowns
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      router.push('/auth/login?role=owner');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth/login?role=owner');
    }
  };

  // Handle search with dynamic results
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      setShowSearchResults(true);
      // Mock search results - replace with actual API call
      const mockResults = [
        { type: 'tenant', name: 'John Doe - Room 101', id: '1' },
        { type: 'property', name: 'Green Valley PG', id: '1' },
        { type: 'payment', name: 'Pending Payment - Room 205', id: '1' },
        { type: 'maintenance', name: 'AC Repair - Room 304', id: '1' }
      ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  // Quick actions for industry-level functionality
  const quickActions = [
    { 
      icon: Plus, 
      label: "Add Property", 
      description: "Register new property",
      action: () => router.push('/dashboard/owner/properties/add'),
      color: "bg-blue-500 hover:bg-blue-600" 
    },
    { 
      icon: Users, 
      label: "Add Tenant", 
      description: "Register new tenant",
      action: () => router.push('/dashboard/owner/tenants/add'),
      color: "bg-green-500 hover:bg-green-600" 
    },
    { 
      icon: IndianRupee, 
      label: "Record Payment", 
      description: "Add payment entry",
      action: () => router.push('/dashboard/owner/payments/add'),
      color: "bg-yellow-500 hover:bg-yellow-600" 
    },
    { 
      icon: MessageSquare, 
      label: "Send Notice", 
      description: "Communicate with tenants",
      action: () => router.push('/dashboard/owner/communications/new'),
      color: "bg-purple-500 hover:bg-purple-600" 
    },
    { 
      icon: BarChart3, 
      label: "Generate Report", 
      description: "Financial & analytics reports",
      action: () => router.push('/dashboard/owner/reports'),
      color: "bg-indigo-500 hover:bg-indigo-600" 
    },
    { 
      icon: FileText, 
      label: "Create Invoice", 
      description: "Generate tenant invoices",
      action: () => router.push('/dashboard/owner/invoices/create'),
      color: "bg-red-500 hover:bg-red-600" 
    }
  ];

  // Profile menu items
  const profileMenuItems = [
    { icon: User, label: "Profile Settings", action: () => router.push('/dashboard/owner/profile') },
    { icon: Building2, label: "Property Management", action: () => router.push('/dashboard/owner/properties') },
    { icon: Settings, label: "Account Settings", action: () => router.push('/dashboard/owner/settings') },
    { icon: HelpCircle, label: "Help & Support", action: () => router.push('/dashboard/owner/help') },
    { icon: LogOut, label: "Logout", action: handleLogout, dangerous: true }
  ];

  // Get avatar URL or initials
  const getAvatarDisplay = () => {
    if (user?.avatar) {
      return <img src={user.avatar} alt={ownerName} className="w-8 h-8 rounded-full object-cover" />;
    }
    const initials = ownerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
        {initials}
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg h-16 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
              title="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            {/* Logo & Brand - Dynamic per Owner */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">PropertyHub Pro</h1>
                <p className="text-xs text-gray-500">{primaryPropertyName}</p>
              </div>
            </div>
          </div>

          {/* Center Section - Dynamic Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search tenants, properties, payments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Dynamic Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          result.type === 'tenant' ? 'bg-blue-500' :
                          result.type === 'property' ? 'bg-green-500' :
                          result.type === 'payment' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-700">{result.name}</span>
                        <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <div className="relative" ref={quickActionsRef}>
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
                title="Quick Actions"
              >
                <Plus className="h-5 w-5 text-gray-600" />
              </button>

              {showQuickActions && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
                    <p className="text-xs text-gray-500">Manage your properties efficiently</p>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          action.action();
                          setShowQuickActions(false);
                        }}
                        className={`p-3 rounded-lg text-left transition-all duration-200 hover:scale-105 ${action.color} text-white`}
                      >
                        <action.icon className="h-5 w-5 mb-2" />
                        <div className="text-sm font-medium">{action.label}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs text-gray-500">{unreadNotificationsCount} unread</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {ownerData.notifications.length > 0 ? (
                      ownerData.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'booking' ? 'bg-blue-500' :
                              notification.type === 'payment' ? 'bg-green-500' :
                              notification.type === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
              title="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Dynamic Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
              >
                {getAvatarDisplay()}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">{ownerName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {getAvatarDisplay()}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{ownerName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    {/* Owner Stats Badge */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Properties</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{ownerData.stats.totalProperties}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                          item.dangerous 
                            ? 'hover:bg-red-50 text-red-600' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
