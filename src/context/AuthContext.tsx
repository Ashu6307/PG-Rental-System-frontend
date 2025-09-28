"use client";
import React, { createContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { apiService } from '@/config/api';
import TabSessionManager from '@/utils/TabSessionManager';

interface User {
  id?: string;
  name?: string;
  email?: string;
  businessName?: string;
  ownerName?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string;
  role: string;
  isAuthenticated: boolean;
  loading: boolean;
  tabId: string;
  activeSessionsCount: number;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  login: (token: string, userData: User, userRole: string) => void;
  logout: () => void;
  switchRole: (newRole: string) => void;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabId, setTabId] = useState<string>('');
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);

  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const tokenRefreshInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionManager = useRef<TabSessionManager | null>(null);

  // Initialize session manager
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionManager.current = TabSessionManager.getInstance();
      setTabId(sessionManager.current.getTabId());
      
      // Check for existing session (handles both same tab and page refresh)
      const existingSession = sessionManager.current.getSession();
      if (existingSession && sessionManager.current.isTokenValid(existingSession.token)) {
        setUser(existingSession.user);
        setToken(existingSession.token);
        setRole(existingSession.role);
        setIsAuthenticated(true);
        
        // Set API default headers
        apiService.setAuthToken(existingSession.token);
        
        console.log('Session recovered:', existingSession.user?.email);
      } else {
        // Check if this is truly a new tab (not a page refresh)
        if (sessionManager.current.isNewTab()) {
          console.log('New tab detected - user must login again');
        }
        // No valid session found
        setIsAuthenticated(false);
        setUser(null);
        setToken('');
        setRole('');
      }
      
      setLoading(false);
      updateActiveSessionsCount();
    }
  }, []);

  // Update active sessions count periodically
  useEffect(() => {
    const updateCount = () => {
      if (sessionManager.current) {
        setActiveSessionsCount(sessionManager.current.getActiveSessionsCount());
      }
    };

    updateCount();
    const interval = setInterval(updateCount, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateActiveSessionsCount = useCallback(() => {
    if (sessionManager.current) {
      setActiveSessionsCount(sessionManager.current.getActiveSessionsCount());
    }
  }, []);

  const login = useCallback((newToken: string, userData: User, userRole: string) => {
    if (!sessionManager.current) return Promise.resolve();

    // Create new session
    sessionManager.current.createSession(newToken, userData, userRole);
    
    // Update state
    setUser(userData);
    setToken(newToken);
    setRole(userRole);
    setIsAuthenticated(true);
    
    // Set API default headers
    apiService.setAuthToken(newToken);
    
    updateActiveSessionsCount();
    
    // Return a promise to indicate login completion
    return Promise.resolve();
  }, [updateActiveSessionsCount]);

  const logout = useCallback(() => {
    if (sessionManager.current) {
      sessionManager.current.removeSession();
    }
    
    // Clear state
    setUser(null);
    setToken('');
    setRole('');
    setIsAuthenticated(false);
    
    // Clear API default headers
    apiService.setAuthToken('');
    
    // Clear browser storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userRole');
    }
    
    updateActiveSessionsCount();
  }, [updateActiveSessionsCount]);

  const switchRole = useCallback((newRole: string) => {
    if (!sessionManager.current || !user) return;

    // Update session with new role
    sessionManager.current.switchRole(newRole);
    setRole(newRole);
    
    updateActiveSessionsCount();
  }, [user, updateActiveSessionsCount]);

  const refreshSession = useCallback(async () => {
    if (!sessionManager.current || !token) return;

    try {
      const response = await apiService.get('/api/auth/refresh', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.success && response.token) {
        sessionManager.current.updateSession({
          token: response.token,
          timestamp: Date.now()
        });
        
        setToken(response.token);
        apiService.setAuthToken(response.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [token, logout]);

  // Auto token refresh
  useEffect(() => {
    if (isAuthenticated && token) {
      // Refresh token every 15 minutes
      tokenRefreshInterval.current = setInterval(() => {
        refreshSession();
      }, 15 * 60 * 1000);

      return () => {
        if (tokenRefreshInterval.current) {
          clearInterval(tokenRefreshInterval.current);
        }
      };
    }
  }, [isAuthenticated, token, refreshSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    tabId,
    activeSessionsCount,
    setUser,
    setToken,
    setRole,
    setIsAuthenticated,
    login,
    logout,
    switchRole,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;