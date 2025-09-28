"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { userDashboardService, UserNotification } from '@/services/userDashboardService';
import { AuthContext } from './AuthContext';

interface NotificationState {
  notifications: UserNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
  filters: {
    read?: boolean;
    type?: string;
  };
}

interface NotificationContextType extends NotificationState {
  // Data fetching
  fetchNotifications: (page?: number, filters?: any) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Real-time notifications
  addNotification: (notification: UserNotification) => void;
  removeNotification: (notificationId: string) => void;
  
  // Filter management
  setFilters: (filters: NotificationState['filters']) => void;
  clearFilters: () => void;
  
  // Utility
  refreshNotifications: () => Promise<void>;
  clearError: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 20,
  },
  filters: {},
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<NotificationState>(initialState);
  const authContext = useContext(AuthContext);

  // Fetch notifications
  const fetchNotifications = async (page: number = 1, filters?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const params = {
        page,
        limit: state.pagination.limit,
        ...state.filters,
        ...filters,
      };
      const response = await userDashboardService.getNotifications(params);
      setState(prev => ({
        ...prev,
        notifications: page === 1 ? response.notifications : [...prev.notifications, ...response.notifications],
        unreadCount: response.unreadCount,
        pagination: response.pagination,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        loading: false,
      }));
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await userDashboardService.markNotificationAsRead(notificationId);
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await userDashboardService.markAllNotificationsAsRead();
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification: UserNotification) => {
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + (notification.read ? 0 : 1),
    }));
  };

  // Remove notification
  const removeNotification = (notificationId: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n._id === notificationId);
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n._id !== notificationId),
        unreadCount: notification && !notification.read 
          ? Math.max(0, prev.unreadCount - 1) 
          : prev.unreadCount,
      };
    });
  };

  // Set filters
  const setFilters = (filters: NotificationState['filters']) => {
    setState(prev => ({ ...prev, filters }));
    fetchNotifications(1);
  };

  // Clear filters
  const clearFilters = () => {
    setState(prev => ({ ...prev, filters: {} }));
    fetchNotifications(1);
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchNotifications(1);
  };

  // Clear error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Auto-fetch notifications when user is authenticated
  useEffect(() => {
    if (authContext?.isAuthenticated && authContext?.token) {
      fetchNotifications();
    }
  }, [authContext?.isAuthenticated, authContext?.token]);

  // Auto-refresh unread count periodically
  useEffect(() => {
    if (authContext?.isAuthenticated) {
      const interval = setInterval(() => {
        fetchNotifications(1, { read: false });
      }, 2 * 60 * 1000); // Check for new notifications every 2 minutes

      return () => clearInterval(interval);
    }
  }, [authContext?.isAuthenticated]);

  const contextValue: NotificationContextType = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    setFilters,
    clearFilters,
    refreshNotifications,
    clearError,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;