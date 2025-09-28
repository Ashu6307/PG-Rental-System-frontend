"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { userDashboardService, DashboardStats, UserProfile, UserBooking, UserFavorite, RecentActivity, UserAnalytics } from '@/services/userDashboardService';
import { AuthContext } from './AuthContext';

interface DashboardState {
  stats: DashboardStats | null;
  profile: UserProfile | null;
  bookings: UserBooking[];
  favorites: UserFavorite[];
  recentActivity: RecentActivity[];
  analytics: UserAnalytics | null;
  loading: {
    stats: boolean;
    profile: boolean;
    bookings: boolean;
    favorites: boolean;
    activity: boolean;
    analytics: boolean;
  };
  error: {
    stats: string | null;
    profile: string | null;
    bookings: string | null;
    favorites: string | null;
    activity: string | null;
    analytics: string | null;
  };
  pagination: {
    bookings: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
    favorites: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
    };
  };
  filters: {
    bookings: {
      status?: string;
      dateRange?: { start: string; end: string };
    };
    favorites: {
      location?: string;
      budget?: { min: number; max: number };
      sortBy?: string;
    };
  };
}

interface DashboardContextType extends DashboardState {
  // Data fetching methods
  fetchDashboardStats: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchUserBookings: (page?: number, filters?: any) => Promise<void>;
  fetchUserFavorites: (page?: number, filters?: any) => Promise<void>;
  fetchRecentActivity: (limit?: number) => Promise<void>;
  fetchUserAnalytics: () => Promise<void>;
  
  // Profile management
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  
  // Favorites management
  toggleFavorite: (pgId: string) => Promise<boolean>;
  removeFavorite: (pgId: string) => Promise<void>;
  
  // Booking management
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  
  // Filter management
  setBookingFilters: (filters: DashboardState['filters']['bookings']) => void;
  setFavoriteFilters: (filters: DashboardState['filters']['favorites']) => void;
  clearFilters: () => void;
  
  // Utility methods
  refreshAll: () => Promise<void>;
  clearError: (section: keyof DashboardState['error']) => void;
}

const initialState: DashboardState = {
  stats: null,
  profile: null,
  bookings: [],
  favorites: [],
  recentActivity: [],
  analytics: null,
  loading: {
    stats: false,
    profile: false,
    bookings: false,
    favorites: false,
    activity: false,
    analytics: false,
  },
  error: {
    stats: null,
    profile: null,
    bookings: null,
    favorites: null,
    activity: null,
    analytics: null,
  },
  pagination: {
    bookings: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 10,
    },
    favorites: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 12,
    },
  },
  filters: {
    bookings: {},
    favorites: {},
  },
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const authContext = useContext(AuthContext);

  // Helper function to update loading state
  const setLoading = (section: keyof DashboardState['loading'], loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [section]: loading }
    }));
  };

  // Helper function to set error
  const setError = (section: keyof DashboardState['error'], error: string | null) => {
    setState(prev => ({
      ...prev,
      error: { ...prev.error, [section]: error }
    }));
  };

  // Clear error
  const clearError = (section: keyof DashboardState['error']) => {
    setError(section, null);
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    setLoading('stats', true);
    setError('stats', null);
    try {
      const stats = await userDashboardService.getDashboardStats();
      setState(prev => ({ ...prev, stats }));
    } catch (error) {
      setError('stats', error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading('stats', false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    setLoading('profile', true);
    setError('profile', null);
    try {
      const profile = await userDashboardService.getUserProfile();
      setState(prev => ({ ...prev, profile }));
    } catch (error) {
      setError('profile', error instanceof Error ? error.message : 'Failed to fetch user profile');
    } finally {
      setLoading('profile', false);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async (page: number = 1, filters?: any) => {
    setLoading('bookings', true);
    setError('bookings', null);
    try {
      const params = {
        page,
        limit: state.pagination.bookings.limit,
        ...state.filters.bookings,
        ...filters,
      };
      const response = await userDashboardService.getUserBookings(params);
      setState(prev => ({
        ...prev,
        bookings: page === 1 ? response.bookings : [...prev.bookings, ...response.bookings],
        pagination: { ...prev.pagination, bookings: response.pagination }
      }));
    } catch (error) {
      setError('bookings', error instanceof Error ? error.message : 'Failed to fetch bookings');
    } finally {
      setLoading('bookings', false);
    }
  };

  // Fetch user favorites
  const fetchUserFavorites = async (page: number = 1, filters?: any) => {
    setLoading('favorites', true);
    setError('favorites', null);
    try {
      const params = {
        page,
        limit: state.pagination.favorites.limit,
        ...state.filters.favorites,
        ...filters,
      };
      const response = await userDashboardService.getFavoritePGs(params);
      setState(prev => ({
        ...prev,
        favorites: page === 1 ? response.favorites : [...prev.favorites, ...response.favorites],
        pagination: { ...prev.pagination, favorites: response.pagination }
      }));
    } catch (error) {
      setError('favorites', error instanceof Error ? error.message : 'Failed to fetch favorites');
    } finally {
      setLoading('favorites', false);
    }
  };

  // Fetch recent activity
  const fetchRecentActivity = async (limit: number = 10) => {
    setLoading('activity', true);
    setError('activity', null);
    try {
      const activity = await userDashboardService.getRecentActivity(limit);
      setState(prev => ({ ...prev, recentActivity: activity }));
    } catch (error) {
      setError('activity', error instanceof Error ? error.message : 'Failed to fetch recent activity');
    } finally {
      setLoading('activity', false);
    }
  };

  // Fetch user analytics
  const fetchUserAnalytics = async () => {
    setLoading('analytics', true);
    setError('analytics', null);
    try {
      const analytics = await userDashboardService.getUserAnalytics();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      setError('analytics', error instanceof Error ? error.message : 'Failed to fetch analytics');
    } finally {
      setLoading('analytics', false);
    }
  };

  // Update profile
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    setLoading('profile', true);
    setError('profile', null);
    try {
      const updatedProfile = await userDashboardService.updateUserProfile(profileData);
      setState(prev => ({ ...prev, profile: updatedProfile }));
    } catch (error) {
      setError('profile', error instanceof Error ? error.message : 'Failed to update profile');
      throw error;
    } finally {
      setLoading('profile', false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      const response = await userDashboardService.uploadProfilePicture(file);
      // Update profile with new avatar
      if (state.profile) {
        setState(prev => ({
          ...prev,
          profile: { ...prev.profile!, avatar: response.avatarUrl }
        }));
      }
      return response.avatarUrl;
    } catch (error) {
      throw error;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (pgId: string): Promise<boolean> => {
    try {
      const response = await userDashboardService.toggleFavorite(pgId);
      
      // Update favorites list
      if (response.isFavorite) {
        // Refresh favorites to get the new item
        await fetchUserFavorites(1);
      } else {
        // Remove from favorites list
        setState(prev => ({
          ...prev,
          favorites: prev.favorites.filter(fav => fav.pgId._id !== pgId)
        }));
      }
      
      // Update stats
      await fetchDashboardStats();
      
      return response.isFavorite;
    } catch (error) {
      throw error;
    }
  };

  // Remove favorite
  const removeFavorite = async (pgId: string) => {
    try {
      await userDashboardService.removeFavorite(pgId);
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.filter(fav => fav.pgId._id !== pgId)
      }));
      // Update stats
      await fetchDashboardStats();
    } catch (error) {
      throw error;
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      await userDashboardService.cancelBooking(bookingId, reason);
      // Update booking status in state
      setState(prev => ({
        ...prev,
        bookings: prev.bookings.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      }));
      // Refresh stats and recent activity
      await Promise.all([fetchDashboardStats(), fetchRecentActivity()]);
    } catch (error) {
      throw error;
    }
  };

  // Set booking filters
  const setBookingFilters = (filters: DashboardState['filters']['bookings']) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, bookings: filters }
    }));
    // Auto-refresh bookings with new filters
    fetchUserBookings(1);
  };

  // Set favorite filters
  const setFavoriteFilters = (filters: DashboardState['filters']['favorites']) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, favorites: filters }
    }));
    // Auto-refresh favorites with new filters
    fetchUserFavorites(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      filters: { bookings: {}, favorites: {} }
    }));
    // Refresh data
    Promise.all([fetchUserBookings(1), fetchUserFavorites(1)]);
  };

  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchUserProfile(),
      fetchUserBookings(1),
      fetchUserFavorites(1),
      fetchRecentActivity(),
      fetchUserAnalytics(),
    ]);
  };

  // Auto-fetch data when user is authenticated
  useEffect(() => {
    if (authContext?.isAuthenticated && authContext?.token) {
      refreshAll();
    }
  }, [authContext?.isAuthenticated, authContext?.token]);

  // Auto-refresh stats periodically
  useEffect(() => {
    if (authContext?.isAuthenticated) {
      const interval = setInterval(() => {
        fetchDashboardStats();
        fetchRecentActivity();
      }, 5 * 60 * 1000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [authContext?.isAuthenticated]);

  const contextValue: DashboardContextType = {
    ...state,
    fetchDashboardStats,
    fetchUserProfile,
    fetchUserBookings,
    fetchUserFavorites,
    fetchRecentActivity,
    fetchUserAnalytics,
    updateProfile,
    uploadProfilePicture,
    toggleFavorite,
    removeFavorite,
    cancelBooking,
    setBookingFilters,
    setFavoriteFilters,
    clearFilters,
    refreshAll,
    clearError,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;