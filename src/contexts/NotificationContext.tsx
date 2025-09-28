'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Notification interface
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'user' | 'property' | 'alert' | 'success' | 'info';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  userId?: string;
  data?: any;
}

// Context interface
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
  addNotification: (notification: Omit<Notification, '_id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock data for development
const mockNotifications: Notification[] = [
  {
    _id: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for Ocean View Villa has been confirmed',
    type: 'booking',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: '2',
    title: 'Payment Received',
    message: 'Payment of ₹15,000 has been processed successfully',
    type: 'payment',
    priority: 'normal',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    _id: '3',
    title: 'Profile Updated',
    message: 'Your profile information has been updated successfully',
    type: 'user',
    priority: 'low',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    _id: '4',
    title: 'New Property Available',
    message: 'A new property matching your preferences is now available',
    type: 'property',
    priority: 'normal',
    read: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    _id: '5',
    title: 'Security Alert',
    message: 'Login detected from a new device',
    type: 'alert',
    priority: 'high',
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true, updatedAt: new Date().toISOString() }
            : notification
        )
      );
      
      setError(null);
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotifications(prev => 
        prev.map(notification => ({ 
          ...notification, 
          read: true, 
          updatedAt: new Date().toISOString() 
        }))
      );
      
      setError(null);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
      
      setError(null);
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete all read notifications
  const deleteAllRead = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNotifications(prev => prev.filter(notification => !notification.read));
      
      setError(null);
    } catch (err) {
      setError('Failed to delete read notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh notifications
  const refresh = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch from API here
      // For now, we'll just reset to mock data
      setNotifications(mockNotifications);
      
    } catch (err) {
      setError('Failed to refresh notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new notification
  const addNotification = (notificationData: Omit<Notification, '_id' | 'createdAt' | 'read'>): void => {
    const newNotification: Notification = {
      ...notificationData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        refresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refresh,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;