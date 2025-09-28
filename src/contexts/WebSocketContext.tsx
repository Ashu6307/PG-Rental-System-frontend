'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string, callback?: (data: any) => void) => void;
  emit: (event: string, data?: any) => void;
  subscribeToRoom: (room: 'dashboard' | 'bookings' | 'notifications' | 'analytics') => void;
  unsubscribeFromRoom: (room: 'dashboard' | 'bookings' | 'notifications' | 'analytics') => void;
  lastUpdate: Date | null;
  retryConnection: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const eventCallbacks = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  }, []);

  const createConnection = useCallback(() => {
    const token = getAuthToken();
    
    if (!token) {
      setError('Authentication token not found');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('WebSocket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      reconnectAttempts.current = 0;
      setLastUpdate(new Date());
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastUpdate(new Date());
      
      // Auto-reconnect unless it was intentional
      if (reason !== 'io client disconnect' && reconnectAttempts.current < maxReconnectAttempts) {
        scheduleReconnect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
      setConnectionStatus('error');
      setError(error.message);
      
      if (reconnectAttempts.current < maxReconnectAttempts) {
        scheduleReconnect();
      } else {
        setError(`Failed to connect after ${maxReconnectAttempts} attempts`);
      }
    });

    // Status events
    newSocket.on('connection:status', (data) => {
      console.log('Connection status:', data);
      setLastUpdate(new Date());
    });

    newSocket.on('pong', (data) => {
      setLastUpdate(new Date(data.timestamp));
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setError(error.message || 'Unknown WebSocket error');
    });

    setSocket(newSocket);

    return newSocket;
  }, [getAuthToken]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff, max 30s
    
    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current++;
      console.log(`Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
      createConnection();
    }, delay);
  }, [createConnection]);

  const retryConnection = useCallback(() => {
    reconnectAttempts.current = 0;
    if (socket) {
      socket.disconnect();
    }
    createConnection();
  }, [socket, createConnection]);

  // Subscription management
  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    if (!eventCallbacks.current.has(event)) {
      eventCallbacks.current.set(event, new Set());
    }
    eventCallbacks.current.get(event)!.add(callback);

    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  const unsubscribe = useCallback((event: string, callback?: (data: any) => void) => {
    if (callback) {
      eventCallbacks.current.get(event)?.delete(callback);
      if (socket) {
        socket.off(event, callback);
      }
    } else {
      eventCallbacks.current.delete(event);
      if (socket) {
        socket.removeAllListeners(event);
      }
    }
  }, [socket]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: socket not connected`);
    }
  }, [socket, isConnected]);

  // Room subscription helpers
  const subscribeToRoom = useCallback((room: 'dashboard' | 'bookings' | 'notifications' | 'analytics') => {
    emit(`${room}:subscribe`);
  }, [emit]);

  const unsubscribeFromRoom = useCallback((room: 'dashboard' | 'bookings' | 'notifications' | 'analytics') => {
    emit(`${room}:unsubscribe`);
  }, [emit]);

  // Initialize connection
  useEffect(() => {
    if (autoConnect && typeof window !== 'undefined') {
      createConnection();
    }

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (socket) {
        socket.disconnect();
      }
    };
  }, [autoConnect, createConnection]);

  // Re-subscribe to events when socket changes
  useEffect(() => {
    if (socket && isConnected) {
      // Re-register all event callbacks
      eventCallbacks.current.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          socket.on(event, callback);
        });
      });
    }
  }, [socket, isConnected]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (isConnected && socket) {
      const heartbeat = setInterval(() => {
        socket.emit('ping');
      }, 30000); // Every 30 seconds

      return () => clearInterval(heartbeat);
    }
  }, [isConnected, socket]);

  const contextValue: WebSocketContextType = {
    socket,
    isConnected,
    connectionStatus,
    error,
    subscribe,
    unsubscribe,
    emit,
    subscribeToRoom,
    unsubscribeFromRoom,
    lastUpdate,
    retryConnection
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// Specialized hooks for different types of real-time updates
export const useRealTimeBookings = () => {
  const { subscribe, unsubscribe, subscribeToRoom, isConnected } = useWebSocket();
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      subscribeToRoom('bookings');
      
      const handleBookingUpdate = (data: any) => {
        setUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50 updates
      };

      subscribe('booking:update', handleBookingUpdate);

      return () => {
        unsubscribe('booking:update', handleBookingUpdate);
      };
    }
  }, [isConnected, subscribe, unsubscribe, subscribeToRoom]);

  return { updates, isConnected };
};

export const useRealTimeNotifications = () => {
  const { subscribe, unsubscribe, subscribeToRoom, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isConnected) {
      subscribeToRoom('notifications');
      
      const handleNewNotification = (data: any) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      };

      const handleNotificationUpdate = (data: any) => {
        setNotifications(prev => [data, ...prev.slice(0, 99)]); // Keep last 100
      };

      subscribe('notification:new', handleNewNotification);
      subscribe('notification:update', handleNotificationUpdate);

      return () => {
        unsubscribe('notification:new', handleNewNotification);
        unsubscribe('notification:update', handleNotificationUpdate);
      };
    }
  }, [isConnected, subscribe, unsubscribe, subscribeToRoom]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAsRead, isConnected };
};

export const useRealTimeAnalytics = () => {
  const { subscribe, unsubscribe, subscribeToRoom, isConnected } = useWebSocket();
  const [analyticsUpdates, setAnalyticsUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      subscribeToRoom('analytics');
      
      const handleAnalyticsUpdate = (data: any) => {
        setAnalyticsUpdates(prev => [data, ...prev.slice(0, 19)]); // Keep last 20 updates
      };

      subscribe('analytics:update', handleAnalyticsUpdate);

      return () => {
        unsubscribe('analytics:update', handleAnalyticsUpdate);
      };
    }
  }, [isConnected, subscribe, unsubscribe, subscribeToRoom]);

  return { analyticsUpdates, isConnected };
};

export default WebSocketContext;