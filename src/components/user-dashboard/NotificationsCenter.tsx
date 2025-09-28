'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter, 
  Download, 
  RefreshCw,
  Calendar,
  User,
  Home,
  CreditCard,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
  Settings,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { exportToCsv, exportToJson, formatNotificationsForExport } from '../../utils/exportUtils';

// Simple error alert component inline
const ErrorAlert: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">Error</p>
        <p className="text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
);

// Notification type icons
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking':
      return <Calendar className="w-5 h-5 text-blue-500" />;
    case 'payment':
      return <CreditCard className="w-5 h-5 text-green-500" />;
    case 'user':
      return <User className="w-5 h-5 text-purple-500" />;
    case 'property':
      return <Home className="w-5 h-5 text-orange-500" />;
    case 'alert':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

// Format relative time
const formatRelativeTime = (date: Date | string) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInMs = now.getTime() - notificationDate.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return notificationDate.toLocaleDateString();
};

interface NotificationsCenterProps {
  compact?: boolean;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ compact = false }) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refresh
  } = useNotifications();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read' | string>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter((notification: any) => {
      // Text search
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!notification.title.toLowerCase().includes(searchLower) &&
            !notification.message.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      
      // Read/unread filter
      if (filterType === 'unread' && notification.read) return false;
      if (filterType === 'read' && !notification.read) return false;
      
      // Category filter
      if (filterCategory !== 'all' && notification.type !== filterCategory) return false;
      
      return true;
    })
    .sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'priority':
          aValue = a.priority || 'normal';
          bValue = b.priority || 'normal';
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n: any) => n._id));
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    try {
      await Promise.all(selectedNotifications.map(id => markAsRead(id)));
      setSelectedNotifications([]);
    } catch (error) {
      alert('Failed to mark some notifications as read');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    
    if (window.confirm(`Delete ${selectedNotifications.length} notifications?`)) {
      try {
        await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
        setSelectedNotifications([]);
      } catch (error) {
        alert('Failed to delete some notifications');
      }
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const dataToExport = selectedNotifications.length > 0 
      ? filteredNotifications.filter((n: any) => selectedNotifications.includes(n._id))
      : filteredNotifications;
    
    const formattedData = formatNotificationsForExport(dataToExport);
    const filename = `notifications_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
      exportToCsv(formattedData, filename);
    } else {
      exportToJson(formattedData, filename);
    }
    setShowExportMenu(false);
  };

  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${compact ? 'p-4' : 'p-6'}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <ErrorAlert message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className={`border-b border-gray-100 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                title="Mark all as read"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={deleteAllRead}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              title="Delete all read"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                title="Export notifications"
              >
                <Download className="w-5 h-5" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {!compact && (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Filter by read status"
                  aria-label="Filter by read status"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="Filter by notification type"
                  aria-label="Filter by notification type"
                >
                  <option value="all">All Types</option>
                  <option value="booking">Booking</option>
                  <option value="payment">Payment</option>
                  <option value="user">User</option>
                  <option value="property">Property</option>
                  <option value="alert">Alert</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              {['date', 'type', 'priority'].map((option) => (
                <button
                  key={option}
                  onClick={() => handleSort(option as typeof sortBy)}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg border ${
                    sortBy === option 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="capitalize">{option}</span>
                  {sortBy === option && (
                    sortOrder === 'asc' ? 
                      <SortAsc className="w-3 h-3 ml-1" /> : 
                      <SortDesc className="w-3 h-3 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedNotifications.length} selected
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBulkMarkAsRead}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedNotifications([])}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Select All */}
            {filteredNotifications.length > 0 && (
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Select all</span>
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* Notifications List */}
      <div className={`max-h-96 overflow-y-auto ${compact ? 'p-4' : 'p-6'}`}>
        {loading && notifications.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-gray-900 font-medium mb-1">No notifications</h4>
            <p className="text-gray-500 text-sm">
              {searchQuery || filterType !== 'all' || filterCategory !== 'all' 
                ? 'No notifications match your current filters' 
                : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification: any) => (
              <div
                key={notification._id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  !notification.read 
                    ? 'bg-blue-50 border-blue-100' 
                    : 'bg-gray-50 border-gray-100'
                } ${selectedNotifications.includes(notification._id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                {!compact && (
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    onChange={() => handleSelectNotification(notification._id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                    title="Select notification"
                    aria-label="Select notification"
                  />
                )}
                
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete notification"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with notification settings link */}
      {!compact && (
        <div className="border-t border-gray-100 p-4">
          <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
            <Settings className="w-4 h-4" />
            <span>Notification Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;