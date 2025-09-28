'use client';

import React, { useState, useEffect } from 'react';
import { 
  useRealTimeBookings, 
  useRealTimeNotifications, 
  useRealTimeAnalytics,
  useWebSocket
} from '@/contexts/WebSocketContext';
import {
  Activity,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  Users,
  Star,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface LiveUpdate {
  id: string;
  type: 'booking' | 'notification' | 'analytics' | 'favorite';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  action?: string;
  severity?: 'low' | 'medium' | 'high';
}

const RealTimeUpdates: React.FC = () => {
  const { isConnected } = useWebSocket();
  const { updates: bookingUpdates } = useRealTimeBookings();
  const { notifications } = useRealTimeNotifications();
  const { analyticsUpdates } = useRealTimeAnalytics();
  
  const [allUpdates, setAllUpdates] = useState<LiveUpdate[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'booking' | 'notification' | 'analytics'>('all');

  // Process updates from different sources
  useEffect(() => {
    const processedUpdates: LiveUpdate[] = [];

    // Process booking updates
    bookingUpdates.forEach((update, index) => {
      processedUpdates.push({
        id: `booking-${index}-${update.timestamp}`,
        type: 'booking',
        title: `Booking ${update.action}`,
        description: `${update.data?.propertyName || 'Property'} - ${update.data?.guestName || 'Guest'}`,
        timestamp: new Date(update.timestamp),
        icon: <Calendar className="w-4 h-4 text-blue-500" />,
        action: update.action,
        severity: update.action === 'cancelled' ? 'high' : 'medium'
      });
    });

    // Process notification updates
    notifications.forEach((notification, index) => {
      processedUpdates.push({
        id: `notification-${index}-${notification.timestamp}`,
        type: 'notification',
        title: notification.data?.title || 'New Notification',
        description: notification.data?.message || 'You have a new notification',
        timestamp: new Date(notification.timestamp),
        icon: <Bell className="w-4 h-4 text-yellow-500" />,
        severity: notification.data?.priority || 'low'
      });
    });

    // Process analytics updates
    analyticsUpdates.forEach((update, index) => {
      processedUpdates.push({
        id: `analytics-${index}-${update.timestamp}`,
        type: 'analytics',
        title: `Analytics Update`,
        description: `${update.section} metrics updated`,
        timestamp: new Date(update.timestamp),
        icon: <TrendingUp className="w-4 h-4 text-green-500" />,
        severity: 'low'
      });
    });

    // Sort by timestamp (newest first)
    processedUpdates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Keep only last 50 updates
    setAllUpdates(processedUpdates.slice(0, 50));
  }, [bookingUpdates, notifications, analyticsUpdates]);

  // Filter updates
  const filteredUpdates = allUpdates.filter(update => 
    filter === 'all' || update.type === filter
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTypeStats = () => {
    const stats = {
      booking: allUpdates.filter(u => u.type === 'booking').length,
      notification: allUpdates.filter(u => u.type === 'notification').length,
      analytics: allUpdates.filter(u => u.type === 'analytics').length,
    };
    return stats;
  };

  const stats = getTypeStats();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Activity className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Real-time updates' : 'Updates paused'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Stats */}
        {isExpanded && (
          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">{stats.booking} Bookings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">{stats.notification} Alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">{stats.analytics} Analytics</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex space-x-2">
            {['all', 'booking', 'notification', 'analytics'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Updates List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {!isConnected && (
            <div className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <RefreshCw className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">Real-time updates unavailable</p>
                <p className="text-xs text-gray-500">Updates will resume when connection is restored</p>
              </div>
            </div>
          )}

          {isConnected && filteredUpdates.length === 0 && (
            <div className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Activity className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600">No recent activity</p>
                <p className="text-xs text-gray-500">Live updates will appear here</p>
              </div>
            </div>
          )}

          {filteredUpdates.map((update) => (
            <div
              key={update.id}
              className={`p-4 border-l-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors ${getSeverityColor(update.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {update.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {update.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTimestamp(update.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {update.description}
                  </p>
                  {update.action && (
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-2 ${
                      update.action === 'confirmed' ? 'bg-green-100 text-green-700' :
                      update.action === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {update.action}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connection Status Footer */}
      {isExpanded && (
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <span>Updates: {filteredUpdates.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeUpdates;